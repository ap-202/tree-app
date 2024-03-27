function tokenize(input) {
  let regex = /(\(|\)|\band\b|\bor\b)/g;
  let split_result = input
    .split(regex)
    .map((s) => s.trim())
    .filter((s) => s);

  return split_result;
}

function buildAST(tokens) {
  let stack = [];
  let current = { operator: "root", elements: [] };

  tokens.forEach((token) => {
    if (token === "(") {
      let new_node = { operator: null, elements: [] };
      current.elements.push(new_node);
      stack.push(current);
      current = new_node;
    } else if (token === ")") {
      current = stack.pop();
    } else if (token === "and" || token === "or") {
      current.operator = token;
    } else {
      current.elements.push(token);
    }
  });

  return current.elements.length === 1 ? current.elements[0] : current;
}

function removeUnnecessaryParantheses(ast) {
  function traverse(node) {
    if (!node || typeof node === "string" || !node.elements) {
      return node;
    }

    let new_elements = [];

    node.elements.forEach((child) => {
      let simplified_child = traverse(child);
      if (simplified_child.operator === node.operator) {
        new_elements.push(...simplified_child.elements);
      } else {
        new_elements.push(simplified_child);
      }
    });

    node.elements = new_elements;

    return node;
  }

  return traverse(ast);
}

function removeDuplicates(ast) {
  function traverse(node) {
    if (!node || typeof node === "string" || !node.elements) {
      return node;
    }

    let unique_elems = [];
    let seen = new Set();

    node.elements.forEach((child) => {
      let simplified_child = traverse(child);
      let key = JSON.stringify(simplified_child);
      if (!seen.has(key)) {
        unique_elems.push(simplified_child);
        seen.add(key);
      }
    });

    if (unique_elems.length === 1) {
      return unique_elems[0];
    } else {
      node.elements = unique_elems;
      return node;
    }
  }

  return traverse(ast);
}

function applyAbsorption(ast) {
  function traverse(node) {
    if (!node || typeof node === "string" || !node.elements) {
      return node;
    }

    node.elements = node.elements.map(traverse);

    let remove_idx = -1;
    for (let child of node.elements) {
      remove_idx = node.elements.findIndex((sibling) => {
        return (
          sibling !== child &&
          sibling.operator &&
          sibling.operator !== node.operator &&
          sibling.elements.some((e) => {
            return JSON.stringify(e) === JSON.stringify(child);
          })
        );
      });

      if (remove_idx !== -1) {
        break;
      }
    }
    node.elements = node.elements.filter((_, idx) => idx !== remove_idx);

    if (node.elements.length === 1) {
      return node.elements[0];
    } else {
      return node;
    }
  }

  return traverse(ast);
}

function simplifyAST(ast) {
  let changed = false;
  do {
    let simplified_ast1 = removeUnnecessaryParantheses(ast);
    let simplified_ast2 = removeDuplicates(simplified_ast1);
    let simplified_ast3 = applyAbsorption(simplified_ast2);

    changed = JSON.stringify(ast) !== JSON.stringify(simplified_ast3);
    ast = simplified_ast3;
  } while (changed);

  return ast;
}

// Call this function with input text
export function simplifyInput(input) {
  let tokens = tokenize(input);
  console.log("tokens");
  console.log(tokens);
  let ast = buildAST(tokens);
  console.log("ast");
  console.log(JSON.stringify(ast, null, 2));
  let simplified_ast = simplifyAST(ast);
  console.log("simplified ast");
  console.log(JSON.stringify(simplified_ast, null, 2));

  return simplified_ast;
}

const input = "(A and (B or C)) and (A and B)";
// const input = "(A and (B or C)) and (A and (B and B and (B or B)))";
// const input = "A and (A or B)";
// const input =
//   "Undergraduate Semester level CS 1332 Minimum Grade of C and ((Undergraduate Semester level CS 1332 Minimum Grade of C and F and A and E) or C) and (D and E)";
// const input =
//   "Undergraduate Semester level CS 1332 Minimum Grade of C and (Undergraduate Semester level CS 2200 Minimum Grade of C or Undergraduate Semester level ECE 3057 Minimum Grade of C or Undergraduate Semester level ECE 3058 Minimum Grade of C) and Undergraduate Semester level CS 4400 Minimum Grade of C";
let simplified_ast = simplifyInput(input);