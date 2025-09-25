
import {View, Pressable, Text } from "react-native";
import styles from '../styles';


export default function ConfirmTaskButton({onPressConfirm}){


    return (
      /**Add the item to the list, Set the variables back to default after finished, and then close the window */
      <View>
        <Pressable
          onPress={onPressConfirm}

          style={({pressed}) => [
            styles.repeatStyle,
            {
              backgroundColor : '#f1d092ff',
              marginTop: "5%",  
              height: "60%",
              width: "50%",
              alignSelf: "center",
              marginBottom: "auto",
              opacity : pressed ? 0.5 : 1,
            },
          ]}
        >
          <Text style={styles.offsetTextStyle}>Confirm Task!</Text>
        </Pressable>
      </View>
    );
            
}