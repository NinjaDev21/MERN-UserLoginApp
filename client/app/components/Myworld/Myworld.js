import React, {Component} from 'react';
import { getFromStorage } from "../../utils/storage";

class Myworld extends Component {
    constructor(props){
        super(props);
        this.state = { token:'' };
    }

    componentDidMount() {
        // check for token
        if(this.checkForToken()){
            this.setState({token:this.checkForToken()})
        }
    }

    checkForToken(){
        const obj = getFromStorage('the_main_app');
        if(obj && obj.token){
            return obj.token;
        }else{
            return false;
        }
    }

    render() {
        const { token } = this.state;

        if(token){
            return (
                <div>
                    <p> MY fucking World !  ... </p>
                </div>
            )
        }
            return (
                <div>
                    <p> OutSide of the login area ... </p>
                </div>
            );
    }
}
export default Myworld;
