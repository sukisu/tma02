/**
 * A react native component that shows a Photo and allows comments and votes to be added.
 * 
 * Version history
 * 1.0, 18 January 2024, A Thomson, Intial version
 */

import { Text, TextInput, Button, View, StyleSheet, Dimensions } from 'react-native';
import ScaledImage  from './ScaledImage';
import React, { useState, useEffect } from 'react';
import { Photo } from '../libraries/PhotoService';
import { addComment, addVote } from '../libraries/PhotoService';


type PhotoEditorProps = {
    photo: Photo;
    user: string;
  };

/**
 * A react native component that shows a Photo and allows comments and votes to be added.
 * 
 * @param photo the photo to display
 * @returns     a react native component
 */
export default function PhotoEditor(props: PhotoEditorProps) {
    // State variables to hold the data entered by the user.
    const [votes, setVotes] = useState(props.photo.votes);
    
    // Update the votes when the photo changes
    useEffect(() => {
        setVotes(props.photo.votes);
    }, [props.photo]);
    
    return (
        <View style={styles.container}>
            <ScaledImage uri={props.photo.uri} width={Dimensions.get('window').width}/>
            <Text style={styles.text}>{props.photo.location} by {props.photo.user} by {props.photo.votes}</Text>
            {props.photo.comments.map((comment, index) => (
                <Text style={styles.text} key={index}>{comment}</Text>
            ))}
            <View style={styles.horizontal}>
                 <Button title="Vote" onPress={() => { addVote(props.user, props.photo.id); setVotes(votes+1); }} />
            </View>
        </View>
    );
}

    // Styles for the component
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        horizontal: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 10,
        },
        text: {
            fontSize: 10,
        },
        input: {
            flex: 1,
            borderWidth: 1,
            borderColor: 'black',
        },
    });
    