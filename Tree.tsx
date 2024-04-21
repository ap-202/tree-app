import { Text } from 'native-base';
import { StyleSheet, ScrollView, View } from 'react-native';
import Node from './tree_components/Node'
import Svg, { Line } from 'react-native-svg';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

/* Parse raw course prerequisites from the text to a 2D array of nodes,
   each row of the array corresponding to a row of nodes in the tree. */
const ParseRawPrerequisites = (course: string, prerequisites: string): {id: number, text: string, parent: number}[][] => {
  let prereqs: string[] = [];
  let tempPrereqParsing = prerequisites.split(' ');
  let i = 0;
  while (i < tempPrereqParsing.length) {
    if (tempPrereqParsing[i] == 'AND' || tempPrereqParsing[i] == 'OR') {
      prereqs.push(tempPrereqParsing[i]);
    } else {
      let curr = tempPrereqParsing[i] + ' ' + tempPrereqParsing[i + 1];
      i++;
      for (let j = 0; j < (curr.match(/\(/g) || []).length; j++) {
        prereqs.push('(');
      }
      prereqs.push(curr.replace(/[()]/g, ''));
      for (let j = 0; j < (curr.match(/\)/g) || []).length; j++) {
        prereqs.push(')');
      }
    }
    i++;
  }

  let nodes: {id: number, text: string, parent: number}[][] = [[]];
  let id = 1;
  let openParenCount = 0;
  let andOr: number[] = [];
  let orphans: ({id: number, text: string, parent: number}|null)[] = [];
  i = 0;
  while (i < prereqs.length) {
    let curr = prereqs[i];
    if (curr == '(') {
      openParenCount++;
      while (nodes.length < openParenCount + 2) {
        orphans.push(null);
        nodes.push([]);
        andOr.push(0);
      };
    } else if (curr == ')') {
      andOr[openParenCount] = 0;
      openParenCount--;
    } else {
      let node = {id: id, text: curr, parent: 0};
      if (curr == 'AND' || curr == 'OR') {
        if (!!!andOr[openParenCount]) {
          if (andOr[openParenCount - 1]) {
            node.parent = andOr[openParenCount - 1];
          } else {
            orphans[openParenCount - 1] = node;
          }
          nodes[openParenCount].push(node);
          id++;
          andOr[openParenCount] = node.id;
          if (orphans[openParenCount]) {
            orphans[openParenCount]!.parent = node.id;
            orphans[openParenCount] = null;
          }
        }
      } else {
        if (andOr[openParenCount]) node.parent = andOr[openParenCount] ?? 0;
        else orphans[openParenCount] = node;
        while (nodes.length <= openParenCount + 1) nodes.push([]);
        nodes[openParenCount + 1].push(node);
        id++;
      }
    }
    i++;
  }

  // (CS 2050 OR CS 2051 OR MATH 2106) AND (CS 1332 OR MATH 3012 OR MATH 3022)
  /*
  2050 2051 2106 1332 3012 3022     2
        OR             OR           1
                AND                 0
  */
  nodes.unshift([{id: 0, text: "to take " + course.toUpperCase(), parent: 0}]);
  return nodes;
}

// Assuming the coordinates are the top left of the node
const CalculateNodeAndEdgePositions = (
  nodes: {id: number, text: string, parent: number}[][],
  nodeWidth: number,
  nodeHeight: number,
  verticalGapSize: number,
  minimumHorizontalGapSize: number
): {
  nodes: {text: string, x: number, y: number}[],
  edges: {start: {x: number, y: number}, end: {x: number, y: number}}[],
  canvasWidth: number,
  canvasHeight: number
} => { 
  // Get the maximum width of a level of nodes.
  let canvasWidth = 0;
  let nodeCount = 0;
  for (let i = 0; i < nodes.length; i++) {
    canvasWidth = nodes[i].length > canvasWidth ? nodes[i].length : canvasWidth;
    nodeCount += nodes[i].length;
  }
  canvasWidth = canvasWidth * nodeWidth + (canvasWidth + 1) * minimumHorizontalGapSize;

  let canvasHeight = nodeHeight * nodes.length + verticalGapSize * (nodes.length - 1);

  let newNodes: {text: string, x: number, y: number}[] = new Array(nodeCount);
  let tempEdges: {startNode: number, endNode: number}[] = [];

  for (let i = 0; i < nodes.length; i++) {
    let y = canvasHeight - (verticalGapSize * i + nodeHeight * (i + 1));
    let gapSize = (canvasWidth - (nodes[i].length * nodeWidth)) / (nodes[i].length + 1);
    for (let j = 0; j < nodes[i].length; j++) {
      let node = nodes[i][j];
      let x = gapSize + (nodeWidth + gapSize) * j;
      newNodes[node.id] = {text: node.text, x: x, y: y};
      if (node.id != 0) {
        tempEdges.push({startNode: node.id, endNode: node.parent});
      }
    }
  }

  let edges: {start: {x: number, y: number}, end: {x: number, y: number}}[] = [];
  for (let i = 0; i < tempEdges.length; i++) {
    edges.push({
      start: {
        x: newNodes[tempEdges[i].startNode].x + 0.5 * nodeWidth,
        y: newNodes[tempEdges[i].startNode].y + nodeHeight
      },
      end: {
        x: newNodes[tempEdges[i].endNode].x + 0.5 * nodeWidth,
        y: newNodes[tempEdges[i].endNode].y
      }
    });
  }

  return {nodes: newNodes, edges: edges, canvasWidth: canvasWidth, canvasHeight: canvasHeight};
}

export default function Tree(this: any, props: {course: string, prerequisites: string, setCourse: any}) {
  let nodeWidth = 90;
  let nodeHeight = 50;
  let verticalGapSize = 100;
  let minimumHorizontalGapSize = 25;
  let nodeBorderWidth = 3;
  let edgeWidth = 2;
  let noPrerequisitesNodeSizeMultiplier = 2;

  let nodes: {text: string, x: number, y: number, multiplier?: number}[] = [];
  let edges: {start: {x: number, y: number}, end: {x: number, y: number}}[] = [];
  let canvasWidth = 0;
  let canvasHeight = 0;
  if (!!!props.prerequisites) {
    canvasWidth = nodeWidth * noPrerequisitesNodeSizeMultiplier;
    canvasHeight = nodeHeight * noPrerequisitesNodeSizeMultiplier;
    nodes.push({text: "No prerequisites to take " + props.course.toUpperCase(), x: 0, y: 0, multiplier: noPrerequisitesNodeSizeMultiplier});
  } else {
    let nodesAndEdges = CalculateNodeAndEdgePositions(
      ParseRawPrerequisites(props.course, props.prerequisites),
      nodeWidth, nodeHeight, verticalGapSize, minimumHorizontalGapSize
    );
    nodes = nodesAndEdges.nodes;
    edges = nodesAndEdges.edges;
    canvasWidth = nodesAndEdges.canvasWidth;
    canvasHeight = nodesAndEdges.canvasHeight;
  }

  return (
    <ReactNativeZoomableView
      maxZoom={1.5}
      minZoom={0.5}
      zoomStep={0.5}
      initialZoom={1}
      bindToBorders={true}
      onZoomAfter={this.logOutZoomState}
      style={{
          padding: 10,
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: 'red'
      }}
    >
        {nodes.map((node, index) => <Node key={index} text={node.text} width={nodeWidth} height={nodeHeight} borderWidth={nodeBorderWidth} x={node.x} y={node.y} sizeMultiplier={node.multiplier} setCourse={props.setCourse}/>)}
        <Svg style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}>
          {edges.map((edge, index) => <Line key={index} x1={edge.start.x} y1={edge.start.y} x2={edge.end.x} y2={edge.end.y} strokeWidth={edgeWidth} stroke="black"/>)}
        </Svg>
    </ReactNativeZoomableView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    height: 500,
  }
});