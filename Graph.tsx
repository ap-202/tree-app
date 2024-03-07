import React from 'react';
import ReactFlow from 'reactflow';
 
import 'reactflow/dist/style.css';
 
const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'CS 1301' } },
  { id: '2', position: { x: 200, y: 0 }, data: { label: 'CS 1371' } },
  { id: '3', position: { x: 100, y: 100 }, data: { label: 'CS 1331' } },
  { id: '4', position: { x: 100, y: 200 }, data: { label: 'CS 1332' } },
  { id: '5', position: { x: 100, y: 300 }, data: { label: 'CS 3600' } }
];
const edges = [{ id: 'e1-3', source: '1', target: '3' }, { id: 'e2-3', source: '2', target: '3' }, { id: 'e3-4', source: '3', target: '4' },{ id: 'e4-5', source: '4', target: '5' }];
 
export default function GraphView() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
