import React, { useRef, useEffect } from "react";
import {View, TouchableOpacity, ScrollView, Text } from "react-native";
import styles from '../styles';


export default function TaskList({items = [], onTaskPress, onTaskLongPress, autoScroll = true,}){

    const scrollRef = useRef(null);
    const prevLen = useRef(items.length);

    useEffect(() => {
        if (!autoScroll) return;

        if (items.length > prevLen.current) {
            requestAnimationFrame(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            });
        }
        prevLen.current = items.length;
    }, [items.length, autoScroll]);


    return (

      <View>
            <ScrollView ref={scrollRef}>
                {items.map((task, i) => (
                    <TouchableOpacity
                        key={task.id ?? i}
                        style={styles.taskItem}
                        onPress={onTaskPress}
                        onLongPress={() => onTaskLongPress?.(i, task)}
                    >
                        <Text style={styles.taskItemText}>{task.taskName || '(Untitled)'} - {task.userRepeatChoice}</Text>
                    </TouchableOpacity>
                )
                )}
            </ScrollView>
      </View>
    );
            
}