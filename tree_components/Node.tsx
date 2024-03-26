import { View, Text } from "react-native";

export default function Node(props: {text: string, width: number, height: number, borderWidth: number, x: number, y: number}) {
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
  return (
    <View style={{
      width: props.width,
      height: props.height,
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