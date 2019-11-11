import React from 'react';
import {Steps, Button, message } from 'antd';
import Header from '../component/header'
import SettledIn from './settledIn/settledIn';
import './index.scss';



export default class Registration extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      isShow : true,
    }
  }
  componentDidMount(){
    
  }
  render() {
    const { location } = this.props ||{}
    const { current,tel,reject,merchant_id } = location.state || {}
    return(
      <div style={{background:"#f6f5f5",paddingBottom:"100px"}}>
        <Header isShow={this.state.isShow}/>
        <div className="SettledIn-box wp">
          <SettledIn data={{current : current? current:'', tel : tel ? tel:'',reject : reject ? reject:'',merchant_id : merchant_id ? merchant_id:'',}}/>
        </div>
        
      </div>
    )
  
  }
  
}