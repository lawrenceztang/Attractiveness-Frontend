import React, { useRef, useState, FC } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {Dimensions} from 'react-native';

const MenuItem = ({children, onPress, active}) => {

    return (
        <Pressable style={[styles.menuItemContainer, {
            borderBottomWidth: active ? 1 : 0,
            height: 30,
            width: 30,
            opacity: active ? 1 : .2
        }]} onPress={onPress} hitSlop={10}>
            {children}
        </Pressable>
    )
}


const PaginatedHorizontalList = (childrens, navItems) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const scrollRef = useRef();

    const onPress = (targetIndex) => () => scrollRef.current?.scrollTo({ x: Dimensions.get('window').width * targetIndex })

    const onMomentumScrollEnd = (e: any) => {
        const { nativeEvent } = e;
        const index = Math.round(nativeEvent.contentOffset.x / Dimensions.get('window').width);
        if (index !== activeIndex) setActiveIndex(index)
    }

    return (
          <View style={styles.container}>
            <View style={styles.navContainer}>
                {
                    navItems.map((icon, index) => <MenuItem children={icon} active={activeIndex === index} onPress={onPress(index)} key={index} />)
                }
            </View>
            <ScrollView
                horizontal
                pagingEnabled
                nestedScrollEnabled
                onMomentumScrollEnd={onMomentumScrollEnd}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ref={scrollRef}
            >
                {childrens.map((child, index) => <View style={styles.childrenContainer} key={index}>{child}</View>)}
            </ScrollView>
        </View>
    )

    return (<MenuItem children={childrens[0]} active={activeIndex === 0} onPress={onPress(0)} key={0} />)


}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        flexDirection: 'column',
      },
    optionBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraButtonContainer : {
        flex: 4,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallerButtonContainer : {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundButton1: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'orange',
    },
    centeredContainer: {
        flex: 5,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pictureContainer : {
        width: '100%',
        height: undefined,
        aspectRatio: .75,
    }
})
export default PaginatedHorizontalList;