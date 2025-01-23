/** 
 * This works better than the Image component that comes with React Native, as it 
 * allows the image to be scaled to fit the screen based on the width or height.
 * 
 * To use, import the component and use it like this:
 * <ScaledImage uri={the URI of the image} width={the required width} />
 * 
 * Example:
 * <ScaledImage uri={photo?.uri} width={Dimensions.get('window').width}/>
 * 
 * Dimensions.get('window').width is the width of the screen.
 * photo is an object that contains the URI of the image. the ? denotes that the
 * object may be null, so the code will not crash if the object is null.
 * 
 * The solution is based on the following Stack Overflow answer:
 * https://stackoverflow.com/questions/42170127/auto-scale-image-height-with-react-native/42170351#42170351
 * 
 * Version history:
 * 19/01/2024: Autumn Thomson Initial version, fixed bugs in stackOverflow solution
 *             due to changes in ReactNative. 
 * 25/09/2024: Autumn Thomson, Updated for 24J TMA02, fixed declaration of props
 */
import React, { Component, ComponentProps, ComponentState } from "react";
import { Image } from "react-native";

type ScaledImageProps = ComponentProps<any> & {
    uri: string, 
    width: number,
    height: number
};

export default class ScaledImage extends Component<ScaledImageProps, ComponentState> {

    constructor(props: ScaledImageProps) {
        super(props);
    }

    render() {
        let props: ScaledImageProps = this.props;
        // This is used to set the size of the image. Removed from componentWillMount.
        // This is more reliable, but results in uncessary execution. In a production
        // app, this would be a problem and should be addressed.

        // Bugfix: Dont attempt to set size if there is no image loaded yet. Added
        // this check because the Image.getSize() method was throwing an
        // error when the image was not loaded. Autumn Thomson 19/01/2024
        if (props.uri !== undefined && props.uri!== "") {
            // Get the size of the image.
            Image.getSize(props.uri, (width, height) => {
                if (props.width && !props.height) {
                    this.setState({
                        width: props.width,
                        height: height * (props.width / width)
                    });
                } else if (!props.width && props.height) {
                    this.setState({
                        width: width * (props.height / height),
                        height: props.height
                    });
                } else {
                    this.setState({ width: width, height: height });
                }
            });
        }

        // If the URI is not set, or the state is not set, rdo not display the image.
        // This is necessary because the code above to set the image size is asynchronous.
        // and the render method is called before the size is set. Autumn Thomson 27/02/2024
        if (props.uri === undefined || this.state === null || props.uri === "" || 
           (this.state as ComponentState).height === undefined || (this.state as ComponentState).width === undefined) {
            return ("");
        } else {
            // Everything is set up, so display the image.
            return (
                <Image
                    source={(this.props as ScaledImageProps).uri}
                    style={{ height: (this.state as ComponentState).height, width: (this.state as ComponentState).width }}
                />
            );
        }
    }
}
