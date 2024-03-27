import { Text } from 'native-base';
import { StyleSheet, ScrollView } from 'react-native';
import Node from './tree_components/Node'
import Svg, { Line } from 'react-native-svg';
import { GetNodesFromPrerequisites } from './simplify';

/* Parse raw course prerequisites from the text to a 2D array of nodes,
   each row of the array corresponding to a row of nodes in the tree. */
const ParseRawPrerequisites = (course: string|string[], prerequisites: string|string[]): {id: number, text: string, parent: number}[][] => {
  if (!(typeof course === 'string' || course instanceof String)) {
    prerequisites = '(' + course.join(') AND (') + ')';
    let courses = '';
    if (courses.length == 2) {
      course = course[0].toUpperCase() + ' and ' + course[1].toUpperCase();
    } else {
      for (let i = 0; i < course.length; i++) {
        courses += course[i].toUpperCase();
        if (i < course.length - 2) {
          courses += ', ';
        } else if (i == course.length - 2) {
          courses += 'and ';
        }
        course = courses;
      }
    }
  } else course = course.toUpperCase();

  return GetNodesFromPrerequisites(course, prerequisites);
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
  edges: {start: {x: number, y: number}, end: {x: number, y: number}}[]
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

  return {nodes: newNodes, edges: edges};
}

export default function Tree(props: {course: string, prerequisites: string, setCourse: any}) {
  let nodeWidth = 90;
  let nodeHeight = 50;
  let verticalGapSize = 100;
  let minimumHorizontalGapSize = 25;
  let nodeBorderWidth = 3;
  let edgeWidth = 2;

  let courseNodeColor = 'lightcyan';
  let noPrerequisitesCourseNodeColor = 'lightblue';
  let finalNodeColor = 'lightblue';

  if (!!!props.prerequisites) return (
    <ScrollView style={styles.outer}>
      <ScrollView horizontal style={styles.outer}>
        <Text>asdfasdfasdfasdfasdfasd</Text>
        <Node text={"No prerequisites for " + props.course.toUpperCase()} width={nodeWidth * 1.75} height={nodeHeight * 1.5} borderWidth={nodeBorderWidth} x={0} y={0} setCourse={props.setCourse} courseNodeColor={noPrerequisitesCourseNodeColor}/>
      </ScrollView>
    </ScrollView>
  );

  let nodesAndEdges = CalculateNodeAndEdgePositions(
    ParseRawPrerequisites(props.course, props.prerequisites),
    nodeWidth, nodeHeight, verticalGapSize, minimumHorizontalGapSize
  );
  let nodes = nodesAndEdges.nodes;
  let edges = nodesAndEdges.edges;
  return (
    <ScrollView style={styles.outer}>
      <ScrollView horizontal style={styles.outer}>
        <Text>nodes: {JSON.stringify(nodes)}</Text>
        <Text>edges: {JSON.stringify(edges)}</Text>
        {nodes.map((node, index) => <Node key={index} text={node.text} width={nodeWidth} height={nodeHeight} borderWidth={nodeBorderWidth} x={node.x} y={node.y} setCourse={props.setCourse} courseNodeColor={courseNodeColor} finalNodeColor={finalNodeColor}/>)}
        <Svg style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}>
          {edges.map((edge, index) => <Line key={index} x1={edge.start.x} y1={edge.start.y} x2={edge.end.x} y2={edge.end.y} strokeWidth={edgeWidth} stroke="black"/>)}
        </Svg>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    height: 500,
  }
});