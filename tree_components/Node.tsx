import { View, Text, TouchableOpacity } from "react-native";

export default function Node(props: {text: string, width: number, height: number, borderWidth: number, x: number, y: number, sizeMultiplier?: number, setCourse: any}) {
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
        width: props.width * (props.sizeMultiplier ?? 1),
        height: props.height * (props.sizeMultiplier ?? 1),
        backgroundColor: 'lightcyan',
        borderWidth: props.borderWidth,
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
  return (
    <TouchableOpacity
      style={{
        width: props.width * (props.sizeMultiplier ?? 1),
        height: props.height * (props.sizeMultiplier ?? 1),
        position: 'absolute',
        left: props.x,
        top: props.y,
      }}
      onPress={onNodeClickedGoToTree}
    >
      <View style={{
        width: "100%",
        height: "100%",
        backgroundColor: 'lightcyan',
        borderWidth: props.borderWidth,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text>{props.text}</Text>
      </View>
    </TouchableOpacity>
  )
}