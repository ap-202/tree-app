import { Text } from 'native-base';
import { StyleSheet, ScrollView } from 'react-native';
import Node from './tree_components/Node'
import Svg, { Line } from 'react-native-svg';
import { GetNodesFromPrerequisites } from './simplify';

/* Parse raw course prerequisites from the text to a 2D array of nodes,
   each row of the array corresponding to a row of nodes in the tree. */
const ParseRawPrerequisites = (course: string, prerequisites: string): {id: number, text: string, parent: number}[][] => {
  course = course.toUpperCase();
  if (course.includes(',')) {
    let courses = course.split(',');
    if (courses.length == 2) {
      course = courses[0].trim() + ' and ' + courses[1].trim();
    } else {
      let tempCourse = '';
      for (let i = 0; i < courses.length; i++) {
        tempCourse += courses[i].trim();
        if (i < courses.length - 1) tempCourse += ', ';
        if (i == courses.length - 2) tempCourse += 'and ';
      }
    }
  }

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
  if (!!!props.course) return (<></>);
  let nodeWidth = 90;
  let nodeHeight = 50;
  let verticalGapSize = 100;
  let minimumHorizontalGapSize = 25;
  let nodeBorderWidth = 3;
  let edgeWidth = 2;
  let finalNodeExpansionMultiplier = 1;

  let courseNodeColor = 'lightcyan';
  let noPrerequisitesCourseNodeColor = 'lightblue';
  let finalNodeColor = 'lightblue';

  if (!!!props.prerequisites) return (
    <ScrollView style={styles.outer}>
      <ScrollView horizontal style={styles.outer}>
        <Text>asdfasdfasdfasdfasdfasd</Text>
        <Node text={"No prerequisites for " + props.course.toUpperCase()} width={nodeWidth * 1.75} height={nodeHeight * 1.5} borderWidth={nodeBorderWidth} x={0} y={0} setCourse={props.setCourse} courseNodeColor={noPrerequisitesCourseNodeColor} finalNodeExpansionMultiplier={finalNodeExpansionMultiplier}/>
      </ScrollView>
    </ScrollView>
  );

  let nodesAndEdges = CalculateNodeAndEdgePositions(
    ParseRawPrerequisites(props.course, props.prerequisites),
    nodeWidth, nodeHeight, verticalGapSize, minimumHorizontalGapSize
  );
  let nodes = nodesAndEdges.nodes;
  let edges = nodesAndEdges.edges;

  
  console.log(JSON.stringify(nodes));
  return (
    <ScrollView style={styles.outer}>
      <ScrollView horizontal style={styles.outer}>
        <Text>nodes: {JSON.stringify(nodes)}</Text>
        <Text>edges: {JSON.stringify(edges)}</Text>
        {nodes.map((node, index) => <Node key={index} text={node.text} width={nodeWidth} height={nodeHeight} borderWidth={nodeBorderWidth} x={node.x} y={node.y - (finalNodeExpansionMultiplier - 1) * nodeHeight} setCourse={props.setCourse} courseNodeColor={courseNodeColor} finalNodeColor={finalNodeColor} finalNodeExpansionMultiplier={finalNodeExpansionMultiplier}/>)}
        <Svg style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}>
          {edges.map((edge, index) => <Line key={index} x1={edge.start.x} y1={edge.start.y - (finalNodeExpansionMultiplier - 1) * nodeHeight} x2={edge.end.x} y2={edge.end.y - (finalNodeExpansionMultiplier - 1) * nodeHeight} strokeWidth={edgeWidth} stroke="black"/>)}
        </Svg>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    height: 1000,
  }
});