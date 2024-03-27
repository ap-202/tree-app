import { View, Text, TouchableOpacity } from "react-native";

export default function Node(props: {
  text: string, 
  width: number, 
  height: number, 
  borderWidth: number, 
  x: number, 
  y: number, 
  setCourse: any,
  courseNodeColor: string,
  finalNodeColor?: string,
  finalNodeExpansionMultiplier: number
}) {
  const onNodeClickedGoToTree = () => {
    props.setCourse(props.text);
  }

  if (props.text == 'AND' || props.text == 'OR') {
    return (
      <View style={{
        width: props.width,
        height: props.height,
        position: 'absolute',
        left: props.x,
        top: props.y,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>{props.text}</Text>
      </View>
    )
  }
  if (props.text.startsWith("to take")) {
    return (
      <View style={{
        width: props.width,
        height: props.height * props.finalNodeExpansionMultiplier,
        backgroundColor: props.finalNodeColor ?? props.courseNodeColor,
        borderWidth: props.borderWidth,
        position: 'absolute',
        left: props.x,
        top: props.y,
        alignItems: 'center',
      }}>
        <Text>{props.text}</Text>
      </View>
    )
  }
  return (
    <TouchableOpacity
      style={{
        width: props.width,
        height: props.height,
        position: 'absolute',
        left: props.x,
        top: props.y,
      }}
      onPress={onNodeClickedGoToTree}
    >
      <View style={{
        width: "100%",
        height: "100%",
        backgroundColor: props.courseNodeColor,
        borderWidth: props.borderWidth,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>{props.text}</Text>
      </View>
    </TouchableOpacity>
  )
}