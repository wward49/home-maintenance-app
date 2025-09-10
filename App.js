import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView} from 'react-native';
import { Calendar } from 'react-native-calendars';
//Views are like Divs
//Text displays text on screen
//Function compoments
//onPress={() => console.log("Text Clicked!")} ... ....In line function
//const handlePress = () => console.log("Text Pressed!"); ... ...function... ...hook it up to an action like onPress
//functions need { }...after the arrow when they are doing more than 1 thing


export default function App() {
  const [name, setName] = useState("Wilson");
  const [nameColor, setColor] = useState('#25896a5b');
  const [nameToggle, setToggle] = useState(true);
  const dateToday = new Date().toISOString().split('T')[0];

  const [tasks, setTasks] = useState([]);

  const nameColor1 = '#ee04eeff';
  const nameColor2 = '#7a9c00ff';


  const handlePress = () => console.log("Text Pressed!");

  const addTask = () => {
    setTasks([...tasks, {id: tasks.length, name: `Task #${tasks.length + 1}` }]);
    console.log(tasks.length);
  };

  const changeName = () => {
    
    if(nameToggle){
      setName("Kate!");
      setColor('#ec04e15b');
    }
    else{
      setName("Wilson");
      setColor('#0099ffe5');
    }
    setToggle(!nameToggle);
    console.log("Changing the color of name text!");
  };

  const handleDayPress = (day) => console.log('Selected day:', day.dateString);


console.log("App executed");
  return (
  
    <SafeAreaView style={styles.backScreen}> 
      <Text numberOfLines={1} onPress={handlePress} style={styles.header}>Home Maintenance</Text>
        <View style={styles.calendarBox}>
          <Calendar
            style={styles.fullSizeCalendar}
            onDayPress={handleDayPress}
            markedDates={{[dateToday]:{ selected: true, marked: true, selectedColor: 'blue'},}}
            
            />
        </View>

        <ScrollView style={styles.taskListBox}>{
          //<Text style= {[styles.textTester, {color: nameColor}]}>Hello, my name is {name}</Text>
          tasks.map(task => (
            <View key={task.id} style={styles.taskStyle}>
              <Text>{task.name}</Text>
            </View>
          ))  
        }
        </ScrollView>


        <TouchableOpacity 
          style={styles.addTaskBox} 
          onPress={ () => {
            //changeName();
            addTask();

          }
          
        } >
          <Text>Add Task</Text>
        </TouchableOpacity>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backScreen: {
    flex: 1,
    backgroundColor: '#f3efbbff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },

  calendarBox: {
    width: 400,
    height:300,
    backgroundColor: '#57f5f5ff',
    margin: 10,
  },

  fullSizeCalendar: {
    //flex:1,
  },
  taskListBox: {
    width: 400,
    height: 300,
    backgroundColor: '#fdd0c3ff',

    marginTop: 65,
    borderRadius: 20,
    
  },

  taskStyle: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  addTaskBox: {
    width: 80,
    height: 80,
    backgroundColor: '#b5f3a8ff',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },

  header: {
    fontSize: 24,
    
    fontWeight: 'bold',
    color: '#333',
  },

  textTester: {
    fontSize: 24,
    color: '#25896a5b'

  },


});