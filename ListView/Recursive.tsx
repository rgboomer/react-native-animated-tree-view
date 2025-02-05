import React, { CSSProperties, useState } from 'react';
import {
  View,
  ScrollView,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  ViewStyle,
  Image,
  ViewProps,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
} from 'react-native';
import ListItems from './ListItems';

export type TreeNode = {
  value:string,
  name:string,
  items?:TreeNode[],
  onPress?:any,
}

type TreeViewProps = {
  containerStyle?:ViewStyle,
  listContainerStyle?:CSSProperties,
  listItemStyle?:CSSProperties,
  data:TreeNode[],
  displayNodeName?:string,
  childrenNodeName?:string,
  onClick?:Function,
  onPress?:Function,
  rest?:any,
}

export default function TreeView(props:TreeViewProps) {
  const [selectedOptions, setSelectedOptions] = useState({});

  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

  const {
    containerStyle,
    listContainerStyle,
    listItemStyle,
    data,
    displayNodeName,
    childrenNodeName,
    ...rest
  } = props;
  let dNN = displayNodeName ? displayNodeName : 'name';
  let cNN = childrenNodeName ? childrenNodeName : 'items';

  const selectAccountFunc = (selectedOptions:any, option:any) => {
    props.onPress && props.onPress(option);
    if (option[cNN]) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedOptions({ ...selectedOptions });
    } else {
      props.onClick && props.onClick(option);
    }
  };

  let checkType = data ? (data instanceof Array ? data : []) : [];
  return (
    <ScrollView contentContainerStyle={containerStyle || styles.containerStyle}>
      <OptionsList
        options={checkType}
        listContainerStyle={listContainerStyle || styles.listContainerStyle}
        listItemStyle={listItemStyle || styles.listItemStyle}
        selectedOptions={selectedOptions}
        onChange={selectAccountFunc}
        displayNodeName={dNN}
        childrenNodeName={cNN}
        {...rest}
      />
    </ScrollView>
  );
};

// Recursive component
const OptionsList = ({
  options,
  selectedOptions,
  onChange,
  listContainerStyle,
  ...rest
}:any) => {
  const { displayNodeName, childrenNodeName } = rest;
  const handleParentClicked = (option:any) => {
    if (selectedOptions[option.value]) {
      delete selectedOptions[option.value];
    } else {
      selectedOptions[option.value] = {};
    }
    onChange(selectedOptions, option);
  };

  const handleSubOptionsListChange = (subSelections:any, option:any) => {
    selectedOptions[option.value] = subSelections;
    onChange(selectedOptions, option);
  };

  return (
    <View>
      {options.map((option:any, k:any) => (
        <View key={k} style={{ ...listContainerStyle }}>
          <List
            index={k}
            selected={selectedOptions[option.value]}
            label={option[displayNodeName]}
            items={option[childrenNodeName]}
            onChange={() => {
              handleParentClicked(option);
            }}
            {...rest}
          />

          {/* Recursive Case */}
          {option[childrenNodeName] &&
            option[childrenNodeName].length > 0 &&
            selectedOptions[option.value] && (
              <View
                style={{
                  marginStart: 15,
                }}>
                <OptionsList
                  options={option[childrenNodeName]}
                  selectedOptions={selectedOptions[option.value]}
                  onChange={(subSelections:any, opt:any) => {
                    handleSubOptionsListChange(subSelections, opt);
                  }}
                  listContainerStyle={{
                    ...listContainerStyle,
                  }}
                  {...rest}
                />
              </View>
            )}
        </View>
      ))}
    </View>
  );
};

type ListProps = {
  selected:boolean,
  label:string,
  onChange:Function,
  items:TreeNode[],
  value:any,
  listContainerStyle:ViewProps,
  rightElement:Element,
  rightElementWrapperStyle:ViewStyle,
  leftElement:Element,
  listItemStyle:CSSProperties,
  textStyle:TextStyle,
  rightImage:ImageSourcePropType,
  rightImageStyle:ImageStyle,
  rightImageWrapperStyle:ViewStyle,
  leftImageStyle:ImageStyle,
  leftImage:ImageSourcePropType,
}
// Dumb List component, completly controlled by parent
const List = ({
  selected,
  label,
  onChange,
  items,
  value,
  listContainerStyle,
  rightElement,
  rightElementWrapperStyle,
  leftElement,
  listItemStyle,
  textStyle,
  rightImage,
  rightImageStyle,
  rightImageWrapperStyle,
  leftImageStyle,
  leftImage,
}:ListProps) => {
  return (
    <View style={listContainerStyle}>
      <ListItems
        leftElement={
          leftElement || 
            <Image
              style={leftImageStyle || { width: 20, height: 20 }}
              source={{uri:('https://image.flaticon.com/icons/png/512/55/55089.png'|| leftImage)}}
              resizeMode="contain"
            />
        }
        onPress={() => onChange(!selected, label, value, items)}
        text={label}
        listItemStyle={{ ...listItemStyle }}
        textStyle={textStyle}
        rightElement={
          items?.length > 0 &&
          (<View style={rightImageWrapperStyle || rightElementWrapperStyle || styles.rightElementWrapperStyle}>
              {rightElement || 
              <Image
                style={rightImageStyle || { width: 15, height: 15 }}
                source={{uri:('http://www.pngmart.com/files/3/Down-Arrow-PNG-HD.png' || rightImage)}}
                resizeMode="contain"
              />
              }
            </View>
            )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listItemStyle: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
  listContainerStyle: {
    borderTopColor: 'gray',
    borderTopWidth: 1,
    flex: 1,
  },
  rightElementWrapperStyle: {
    alignItems: "flex-end",
    flex: 1,
    paddingRight: 10
  }
});