import React,{Component,PureComponent} from 'react';
import {  HashRouter as Router , Route, Switch,Redirect } from 'react-router-dom';
import RouterConfig from "./routerConfig";
import Login from "./login";
import ForgetPwd from "./forgetPwd";
export default class RouterList extends PureComponent{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Router basename= 'merchant/'>
                <Switch>
                    <Route exact path="/" component={Login} />
                    { RouterConfig && RouterConfig.length && RouterConfig.map((route, i) => {
                        return(
                            <Route key={i} path={route.path} 
                                render={ props => (
                                    <route.component {...props} routes={route.routes}/>
                                )}
                            />
                        )
                    })}
                    {/*<Redirect to="/404" />*/}
                </Switch>
            </Router>
        )
    }
}
