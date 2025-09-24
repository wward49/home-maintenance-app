import React, { useState } from "react";
import {View, StyleSheet, Pressable, Text } from "react-native";
import styles from '../styles';


export default function ConfirmTaskButton({onPressConfirm}){


    return (
      /**Add the item to the list, Set the variables back to default after finished, and then close the window */
      <View>
        <Pressable
          onPress={onPressConfirm}

          style={[
            styles.repeatStyle,
            {
              height: "60%",
              width: "50%",
              alignSelf: "center",
              marginBottom: "auto",
            },
          ]}
        >
          <Text style={styles.repeatTextStyle}>Confirm Task!</Text>
        </Pressable>
      </View>
    );
            
}