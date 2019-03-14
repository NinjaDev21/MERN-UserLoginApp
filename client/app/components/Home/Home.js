import React, { Component } from 'react';
import 'whatwg-fetch';
import { getFromStorage, setInStorage } from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading : true,
        token: '',
        signUpError : '',
        signInError : '',
        signInEmail:'',
        signInPassword:'',
        signUpEmail:'',
        signUpPassword:'',
        signUpName:'',
    };
    this.onSignIn   = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  componentDidMount() {
    // const obj = getFromStorage('the_main_app');
    const { token }  = '';
    if(token){
        // verify token
        fetch('/api/account/verify?token=' + token)
            .then(res => res.json())
            .then(json => {
                if(json.success){
                    // set the token and is loading
                    this.setState({
                        token,
                        isLoading: false
                    })
                }else{
                    this.setState({
                        isLoading: false
                    })
                }
            });

    }else{
        this.setState({ isLoading : false })
    }
  }


 onSignIn(event){
    event.preventDefault();
    console.log(this.emailInput.value + this.passwordInput.value);
    this.setState({isLoading: true});
     let user = {
         email: this.emailInput.value,
         password: this.passwordInput.value,
     };
     fetch('/api/account/signin',
         { method: 'POST' ,
             body: JSON.stringify(user),
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             }, }).then(res => res.json())
         .then(data => {
             // console.log(data);
             if(data.success){
                 // setInStorage('the_main_app',{ token : data.token});
                 this.setState({signInError: data.message, isLoading: false })
             }else{
                 this.setState({signInError: data.message, isLoading: false })
             }
         });
 }

 onSignUp(event){
    event.preventDefault();
    this.setState({isLoading:true});
    // console.log(this.NameInput.value + this.signUpEmailInput.value+ this.SignUpPasswordInput.value);
     let user = {
         name: this.NameInput.value,
         email: this.signUpEmailInput.value,
         password: this.SignUpPasswordInput.value,
     };

     fetch('/api/account/signup',
         { method: 'POST' ,
             body: JSON.stringify(user),
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
             }, }).then(res => res.json())
                .then(data => {
                if(data.success){
                    this.setState({signUpError: data.message, isLoading: false })
                }else{
                    this.setState({signUpError: data.message, isLoading: false })
                }
            });
 }

  render() {
      const { isLoading,
          token,
          signInEmail,
          signInPassword,
          signUpEmail,
          signUpPassword,
          signUpName,
          signUpError,
          signInError
      } = this.state;
      if(isLoading){
          return (<div> <p> Loading ... </p></div>);
      }
      if(!token){
          return (
              <div>
                  <div>
                      {
                          (signInError) ? (
                              <p> {signInError}</p>
                          ) : (null)
                      }
                      <p>Sign in</p>
                      <form onSubmit={this.onSignIn}>
                      <input type="email" placeholder="Email" defaultValue={signInEmail} ref={emailInput => this.emailInput = emailInput} required/>
                      <br/>
                      <input type="password" placeholder="password" defaultValue={signInPassword}  ref={passwordInput => this.passwordInput = passwordInput}/>
                      <br/>
                      <button type="submit" onClick={this.onSignIn}> Sign in</button>
                      </form>
                  </div>

                  <hr/>

                  <div>
                      {
                          (signUpError) ? (
                              <p> {signUpError}</p>
                          ) : (null)
                      }
                      <p>Registration </p>
                      <form onSubmit={this.onSignUp}>
                      <input type="text" placeholder="Name" defaultValue={signUpName} ref={NameInput => this.NameInput = NameInput}/>
                      <br/>
                      <input type="text" placeholder="Email" defaultValue={signUpEmail} ref={signUpEmailInput => this.signUpEmailInput = signUpEmailInput}/>
                      <br/>
                      <input type="password" placeholder="password" defaultValue={signUpPassword} ref={SignUpPasswordInput => this.SignUpPasswordInput = SignUpPasswordInput}/>
                      <br/>
                      <button type="button" onClick={this.onSignUp}> Register </button>
                      </form>
                  </div>
              </div>
          )
      }

    return (
      <>
        My fucking Home Page with no data on it ...
      </>
    );
  }
}

export default Home;
