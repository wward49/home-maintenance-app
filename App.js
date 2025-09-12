import React, { useState, useRef} from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, Button, Alert, Modal} from 'react-native';
import { Calendar } from 'react-native-calendars';
//Views are like Divs
//Text displays text on screen
//Function compoments
//onPress={() => console.log("Text Clicked!")} ... ....In line function
//const handlePress = () => console.log("Text Pressed!"); ... ...function... ...hook it up to an action like onPress
//functions need { }...after the arrow when they are doing more than 1 thing
//array deconstructing: const [current_vale, updater_function] = useState(firstInitialValue);


export default function App() {
  const [items, insertItems] = useState([]);
  const scrollRef = useRef(null);

  const handleInsertItemPress = () => {

    insertItems(previousList => [...previousList, `New Item ${previousList.length + 1}`])

    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true});
    }
    );
  };


  const handleRemoveItemPress = (indexToRemove) => {
    Alert.alert('Remove Task?',
      'Task will be deleted forever',
      [{text: 'Cancel', style: 'cancel'}, 
        {text: 'Delete', style: 'destructive', 
          onPress: () => { 
            insertItems(previousList => previousList.filter((_, i) => i !== indexToRemove));
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.appContainer}>

      {/*Container for the Calendar*/}
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendarStyle}
          firstDay={1}
          theme={{
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
        
        />
      </View>

      {/*Container for the scrollable list of tasks that have been added*/}
      <View style={styles.listOfTasks}>
        <ScrollView ref={scrollRef}>
          {items.map((txt, i) => {
            return(
            <TouchableOpacity key={i} style={styles.taskItem} onPress={() => handleRemoveItemPress(i)}>
              <Text style={styles.taskItemText}>{txt}</Text>
            </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      
      {/*Container for the Button for adding tasks*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonInteractable} onPress={handleInsertItemPress}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/*Container for the Panel for setting up a new task*/}
      <View>
          
      </View>
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#c9ab00ff",
    justifyContent: 'flex-end',

  },
  listOfTasks: {
    marginTop : StatusBar.currentHeight,
    
    backgroundColor: "#5fe710ff",
    width: '70%',
    height: 300,
    alignSelf: 'center',
    marginBottom: 30,

    borderWidth: 5,
    borderColor: "#000000ff",

  },
  taskItem: {
    
    backgroundColor: "#95f199ff",
    marginBottom: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000000ff",
    width: '100%',
    height: 48,

  },
  taskItemText: {
    fontSize: 16,
    color: "#f100c9ff",
    alignSelf: "center"
  },

  buttonContainer: {
    width : 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 50,

  },
  buttonInteractable: {
    flex: 1,
    backgroundColor: '#cc3232ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000ff",

  },

  calendarContainer: {
    
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#aa9deeff',
    borderWidth: 2,
    borderColor: "#000000ff",
  },

  calendarStyle: {

  },

});