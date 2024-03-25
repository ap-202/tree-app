import { NativeBaseProvider, Text } from 'native-base';
import { View } from 'react-native';

export const Tree = (props: {course: string, prerequisites: string}) => {
  let prereqs: string[] = [];
  let tempPrereqParsing = props.prerequisites.split(' ');
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

  let nodes: [{id: number, text: string, parent: number}[]] = [[]];
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
      let node = {id: id++, text: curr, parent: 0};
      if (curr == 'AND' || curr == 'OR') {
        if (!!!andOr[openParenCount]) {
          if (andOr[openParenCount - 1]) {
            node.parent = andOr[openParenCount - 1];
          } else {
            orphans[openParenCount - 1] = node;
          }
          nodes[openParenCount].push(node);
          andOr[openParenCount] = node.id;
          if (orphans[openParenCount]) {
            orphans[openParenCount]!.parent = node.id;
            orphans[openParenCount] = null;
          }
        }
      } else {
        if (andOr[openParenCount]) {
          node.parent = andOr[openParenCount] ?? 0;
        } else {
          orphans[openParenCount] = node;
        }
        nodes[openParenCount + 1].push(node);
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

  return (
    <NativeBaseProvider>
      <View>
        <Text>{JSON.stringify(nodes)}</Text>
      </View>
    </NativeBaseProvider>
  );
}