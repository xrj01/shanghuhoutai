import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'antd';
import "./index.scss";


export default class SetSucceed extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      
    }
  }
  componentDidMount(){
    this.props.setCurrent(2)
    
  }
  componentWillUnmount(){
    sessionStorage.removeItem('current')
  }
  render() {
    return(
      <div className='setSucceed-box'>
        <div className='setSucceed-title'>
            密码重置成功
        </div>
        <div className='setSucceed-margin'>
            下次请使用新密码进行登录
        </div>
        <Link to="/" onClick={this.clear}>
          <Button>进入商家后台</Button>
        </Link>
      </div>
    )
  }
  clear = ()=>{
    sessionStorage.removeItem('current')
  }
  
}