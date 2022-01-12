import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import react from "react";

export default class PickImage extends React.Component {
    state = { image: null }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== "granted") {
                alert("Sorry, we need camera roll permissions to make this work!");
            }
        }
    };

    PickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            })
            if (!result.cancelled) {
                this.setState({
                    image: result.data,
                })
                this.uploadImage(result.uri)
                //uniform resource identifier

            }
        }
        catch (E) {
            console.log(E);
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData()
        let fileName = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const fileToUpload = {
             uri : uri, name : fileName , type : type
          }
          data.append("digit",fileToUpload)
          fetch(" http://25e9-103-123-51-165.ngrok.io " , {
               method : "POST" , body : data , headers : {"content-type" : "multipart/form-data"
            }
          })
          .then((response) => response.json())

          .then((result) => {
               console.log("Success:", result);
             })
             .catch((error) => {
               console.error("Error:", error);
             });
    }
    render() {
        let { image } = this.state;
        //image ---> this.state.image;
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Button title="Pick an image from camera roll" onPress={this.PickImage} />


            </View>
        )
    }
}

//JSON format { key : value }


