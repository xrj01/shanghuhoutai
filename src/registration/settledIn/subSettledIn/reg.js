import React from 'react';
import {Form,Button,Row,Col,Input,Checkbox,message, Modal} from 'antd';
import api from './../../../components/api'

import './reg.scss'
class Reg extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      isAutoFocus: false,
      ischecked: false, //  提交按钮的状态
      isSended: true,  //  是否能够发送
      captchaDate: 60,  //  倒计时秒数
      captchaStatus: false,  //   按钮状态
      secondText: false,
      tel:'',//注册的手机号
      merchant_id:'',//商户ID

      visible: false,
      visible1: false,
    }
  }

  // 获取当前时间
  shouldGoOn() {
    const {telnumber = '',stameTime} = JSON.parse(sessionStorage.getItem('phone')) || {}
    let date = new Date().getTime(),time = 60-Math.floor((date-stameTime) / 1000);
    return {flag: stameTime && (time>0), telnumber, time}
  }
  // 刷新的时候秒数不变
  componentDidMount() {
    const {flag, telnumber, time: captchaDate} = this.shouldGoOn();
    //console.log('telnumber',telnumber);
    if(flag) {
        this.setState({captchaDate, captchaStatus: true,isSended: false,secondText:true}, this.count,);
        this.props.form.setFieldsValue({phone:telnumber})
    }
  }

  

  // 下一步
  next = () =>{
    this.props.next();
  }

  // 协议未被选中时
  handleAgreement = (e) =>{
    if(!e.target.checked){
      this.setState({
        ischecked: true
      })
    }else{
      this.setState({
        ischecked: false
      })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {tailFormItemLayout,formItemLayout} = this.props;
    return(
      <div className="form">
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Form.Item label="手机号" >
            {getFieldDecorator('phone', {
              rules: [
                { required: true, message: '请输入您的手机号码'},{pattern:/^1[345789]\d{9}$/,message:'手机号不正确，请仔细检查' },
              ],
              
            })(
              <Input
                name='userName'
                type='text'
                placeholder="请输入手机号码"
                onBlur={this.checkTel.bind(this)}
                allowClear
                autoComplete='off'
              />,
            )}
          </Form.Item>
          <Form.Item label="验证码" >
            <Row gutter={8}>
              <Col span={17}>
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: '请获取并输入验证码' }],
                  validateTrigger: 'onBlur'
                })(<Input name='captcha' type='text' placeholder="请输入验证码" autocomplete="off"/>)}
              </Col>
              <Col span={7}>
                <Button 
                  style={{marginLeft:'10px',verticalAlign: 'middle'}}
                  disabled={!this.state.isSended}
                  onClick={this.sendCode.bind(this)}
                >
                  {this.state.captchaStatus ? this.state.captchaDate+'秒后重发' : this.state.secondText?'重新获取':'发送验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="登录密码">
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入登录密码' },
                { message: '请填写6-8位数字和字母组成的密码' , pattern : /^([a-z0-9A-Z)]){6,8}$/i},
                { validator: this.validateToNextPassword },
              ]
            })(
              <Input.Password name='password' placeholder="请输入登录密码" autoComplete='new-password'/>,
            )}
          </Form.Item>
          <Form.Item label="确认密码">
            {getFieldDecorator('confirmpwd', {
              rules: [
                { required: true,message: '请再次确认密码' },
                { validator: this.compareToFirstPassword },
              ]
            })(
              <Input.Password 
                name='confirmpwd'
                placeholder="请输入确认密码" 
                onBlur={this.handleConfirmBlur}
                autoComplete='new-password'
              />,
            )}
          </Form.Item>
          
          <Form.Item wrapperCol={{span:16,offset:6}} className='margin'>
            {getFieldDecorator('agreement', {
              valuePropName: 'checked',
              rules: [{ required: true, message: '请选择' }],
              initialValue: true
            })(
              <Checkbox
                autoFocus={this.state.isAutoFocus}
                onChange={this.handleAgreement}
              >
                
              </Checkbox>,
              
            )}
            <span>我已阅读并同意 <span onClick={this.showModal} className='color'>《昂牛商城用户协议》</span><span onClick={this.showModal1} className='color'>《昂牛入驻协议》</span></span>
          </Form.Item>
          <Form.Item wrapperCol={{span:16,offset:6}}>
            {/* <Button onClick={this.next}>上一步</Button> */}
            <Button 
              type="primary" 
              htmlType="submit"
              disabled={this.state.ischecked}
              style = {{width:400}}
            >
              立即注册
            </Button>
          </Form.Item>
        </Form>
        
          <Modal
            width={800}
            height={800}
            visible={this.state.visible}
            
            onCancel={this.handleCancel}
            footer={null}
          >
          
            <h3>昂牛商城用户协议</h3>
            <div className='protocolUsage'>
              <p>1、本软件运用自身开发的操作系统通过国际互联网络为用户提供购买商品等服务。使用本软件，您必须：</p>
              <p>&emsp;（1）自行配备上网的所需设备，包括个人手机、平板电脑、调制解调器、路由器等；</p>
              <p>&emsp;（2）自行负担个人上网所支付的与此服务有关的电话费用、网络费用等；</p>
              <p>&emsp;（3）选择与所安装终端设备相匹配的软件版本，包括但不限于iOS、Android、iPad、Windows Phone等多个昂牛商城发布的应用版本。</p>
              <p>2、基于本软件所提供的网络服务的重要性，您确认并同意：</p>
              <p>&emsp;（1）提供的注册资料真实、准确、完整、合法有效，注册资料如有变动的，应及时更新；</p>
              <p>&emsp;（2）如果您提供的注册资料不合法、不真实、不准确、不详尽的，您需承担因此引起的相应责任及后果，并且昂牛商城保留终止您使用本软件各项服务的权利。</p>
              <p>三、订单</p>
              <p>1、使用本软件下订单，您应具备购买相关商品的权利能力和行为能力，如果您在18周岁以下，您需要在父母或监护人的监护参与下才能使用本软件。在下订单的同时，即视为您满足上述条件，并对您在订单中提供的所有信息的真实性负责。</p>
              <p>2、在您下订单时，请您仔细确认所购商品的名称、价格、数量、型号、规格、尺寸、联系地址、电话、收货人等信息。收货人与您本人不一致的，收货人的行为和意思表示视为您的行为和意思表示，您应对收货人的行为及意思表示的法律后果承担连带责任。</p>
              <p>3、您理解并同意：本软件上销售商展示的商品和价格等信息仅仅是要约邀请，您下单时须填写您希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址（合同履行地点）、合同履行方式等内容；系统生成的订单信息是计算机信息系统根据您填写的内容自动生成的数据，仅是您向销售商发出的合同要约；销售商收到您的订单信息后，只有在销售商将您在订单中订购的商品从仓库实际直接向您发出时（以商品出库为标志），方视为您与销售商之间就实际直接向您发出的商品建立了合同关系；如果您在一份订单里订购了多种商品并且销售商只给您发出了部分商品时，您与销售商之间仅就实际直接向您发出的商品建立了合同关系；只有在销售商实际直接向您发出了订单中订购的其他商品时，您和销售商之间就订单中其他已实际直接向您发出的商品才成立合同关系。</p>
              <p>4、尽管销售商做出最大的努力，但由于市场变化及各种以合理商业努力难以控制因素的影响，本软件无法避免您提交的订单信息中的商品出现缺货情况；如您下单所购买的商品发生缺货，您有权取消订单，销售商亦有权自行取消订单，若您已经付款，则为您办理退款。</p>
              <p>四、配送</p>
              <p>1、您在本软件购买的商品将按照本软件上您所指定的送货地址进行配送。订单信息中列出的送货时间为参考时间，参考时间的计算是根据库存状况、正常的处理过程和送货时间、送货地点的基础上估计得出的。您应当清楚准确地填写您的送货地址、联系人及联系方式等配送信息，您知悉并确认，您所购买的商品应仅由您填写的联系人接受身份查验后接收商品，因您变更联系人或相关配送信息而造成的损失由您自行承担。</p>
              <p>2、因如下情况造成订单延迟或无法配送等，本软件将无法承担迟延配送的责任：</p>
              <p>&emsp;（1）客户提供错误信息和不详细的地址；</p>
              <p>&emsp;（2）货物送达无人签收，由此造成的重复配送所产生的费用及相关的后果。</p>
              <p>&emsp;（3）不可抗力，例如：自然灾害、交通戒严、突发战争等。</p>
              <p>五、用户个人信息保护及授权</p>
              <p>1、您知悉并同意，为方便您使用本软件相关服务，本软件将存储您在使用时的必要信息，包括但不限于您的真实姓名、性别、生日、配送地址、联系方式、通讯录、相册、日历、定位信息等。除法律法规规定的情形外，未经您的许可昂牛商城不会向第三方公开、透露您的个人信息。昂牛商城对相关信息采取专业加密存储与传输方式，利用合理措施保障用户个人信息的安全。</p>
              <p>2、您知悉并确认，您在注册帐号或使用本软件的过程中，需要提供真实的身份信息，昂牛商城将根据国家法律法规相关要求，进行基于移动电话号码的真实身份信息认证。若您提供的信息不真实、不完整，则无法使用本软件或在使用过程中受到限制，同时，由此产生的不利后果，由您自行承担。</p>
              <p>3、您在使用本软件某一特定服务时，该服务可能会另有单独的协议、相关业务规则等（以下统称为“单独协议”），您在使用该项服务前请阅读并同意相关的单独协议；您使用前述特定服务，即视为您已阅读并同意接受相关单独协议。</p>
              <p>4、您充分理解并同意：</p>
              <p>&emsp;（1）接收通过邮件、短信、电话等形式，向在本软件注册、购物的用户、收货人发送的订单信息、促销活动等内容；</p>
              <p>&emsp;（2）为配合行政监管机关、司法机关执行工作，在法律规定范围内昂牛商城有权向上述行政、司法机关提供您在使用本软件时所储存的相关信息，包括但不限于您的注册信息等，或使用相关信息进行证据保全，包括但不限于公证、见证等；</p>
              <p>&emsp;（3）昂牛商城依法保障您在安装或使用过程中的知情权和选择权，在您使用本软件服务过程中，涉及您设备自带功能的服务会提前征得您同意，您一经确认，昂牛商城有权开启包括但不限于收集地理位置、读取通讯录、使用摄像头、启用录音等提供服务必要的辅助功能。</p>
              <p>&emsp;（4）昂牛商城有权根据实际情况，在法律规定范围内自行决定单个用户在本软件及服务中数据的最长储存期限以及用户日志的储存期限，并在服务器上为其分配数据最大存储空间等。</p>
              <p>六、用户行为规范</p>
              <p>1、本协议依据国家相关法律法规规章制定，您同意严格遵守以下义务：</p>
              <p>&emsp;（1）不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；</p>
              <p>&emsp;（2）从中国大陆向境外传输资料信息时必须符合中国有关法规；</p>
              <p>&emsp;（3）不得利用本软件从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；</p>
              <p>&emsp;（4）不得干扰本软件的正常运转，不得侵入本软件及国家计算机信息系统；</p>
              <p>&emsp;（5）不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽的、不文明的等信息资料；</p>
              <p>&emsp;（6）不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；</p>
              <p>&emsp;（7）不得教唆他人从事本条所禁止的行为；</p>
              <p>&emsp;（8）不得利用在本软件注册的账户进行牟利性经营活动；</p>
              <p>&emsp;（9）不得发布任何侵犯他人隐私、个人信息、著作权、商标权等知识产权或合法权利的内容；</p>
              <p>2、您须对自己在网上的言论和行为承担法律责任，您若在本软件上散布和传播反动、色情或其它违反国家法律的信息，本软件的系统记录有可能作为您违反法律的证据。</p>
              <p>七、软件使用规范</p>
              <p>1、关于软件的获取与更新</p>
              <p>&emsp;（1）您可以直接从昂牛商城的网站上获取本软件，也可以从得到昂牛商城授权的第三方获取，如果您从未经昂牛商城授权的第三方获取本软件或与本软件名称相同的安装程序，昂牛商城无法保证该软件能够正常使用，并对因此给您造成的损失不予负责；</p>
              <p>&emsp;（2）为了改善用户体验、完善服务内容，昂牛商城将不断努力开发新的服务，并为您不时提供软件更新，本软件新版本发布后，旧版本的软件可能无法使用，昂牛商城不保证旧版本软件继续可用及相应的客户服务，请您随时核对并下载最新版本。</p>
              <p>2、除非法律允许或昂牛商城书面许可，您使用本软件过程中不得从事下列行为</p>
              <p>&emsp;（1）删除本软件及其副本上关于著作权的信息</p>
              <p>&emsp;（2）对本软件进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件的源代码；</p>
              <p>&emsp;（3）对昂牛商城拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等；</p>
              <p>&emsp;（4）对本软件或者本软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经昂牛商城授权的第三方工具/服务接入本软件和相关系统；</p>
              <p>&emsp;（5）通过修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论这些行为是否为商业目的；</p>
              <p>&emsp;（6）通过非昂牛商城开发、授权的第三方软件、插件、外挂、系统，登录或使用昂牛商城软件及服务，或制作、发布、传播上述工具；</p>
              <p>&emsp;（7）自行或者授权他人、第三方软件对本软件及其组件、模块、数据进行干扰。</p>
              <p>八、违约责任</p>
              <p>1、如果昂牛商城发现或收到他人举报投诉您违反本协议约定的，昂牛商城有权不经通知随时对相关内容进行删除、屏蔽，并视行为情节对违规帐号处以包括但不限于警告、限制或禁止使用部分或全部功能、帐号封禁直至注销的处罚，并公告处理结果。</p>
              <p>2、昂牛商城有权依据合理判断对违反有关法律法规或本协议规定的行为采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，您应独自承担由此而产生的一切法律责任。</p>
              <p>3、您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；昂牛商城因此遭受损失的，您也应当一并赔偿。</p>
              <p>4、除非另有明确的书面说明,昂牛商城不对本软件的运营及其包含在本软件上的信息、内容、材料、产品（包括软件）或服务作任何形式的、明示或默示的声明或担保（根据中华人民共和国法律另有规定的以外）。</p>
              <p>九、所有权及知识产权</p>
              <p>1、您一旦接受本协议，即表明您主动将您在任何时间段在本软件发表的任何形式的信息内容（包括但不限于客户评价、客户咨询、各类话题文章等信息内容）的财产性权利等任何可转让的权利，如著作权财产权（包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利），全部独家且不可撤销地转让给昂牛商城所有，并且您同意昂牛商城有权就任何主体侵权而单独提起诉讼。</p>
              <p>2、本协议已经构成《中华人民共和国著作权法》第二十五条（条文序号依照2010年修订版《著作权法》确定）及相关法律规定的著作财产权等权利转让书面协议，其效力及于您在昂牛商城软件上发布的任何受著作权法保护的作品内容，无论该等内容形成于本协议订立前还是本协议订立后。</p>
              <p>3、您同意并已充分了解本协议的条款，承诺不将已发表于本软件的信息，以任何形式发布或授权其它主体以任何方式使用（包括但不限于在各类网站、媒体上使用）。</p>
              <p>4、除法律另有强制性规定外，未经昂牛商城明确的特别书面许可,任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用本软件的信息内容，否则，昂牛商城有权追究其法律责任。</p>
              <p>5、本软件所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是昂牛商城或其内容提供者的财产，受中国和国际版权法的保护。本软件上所有内容的汇编是昂牛商城的排他财产，受中国和国际版权法的保护。本软件上所有软件都是昂牛商城或其关联公司或其软件供应商的财产，受中国和国际版权法的保护。</p>
              <p>十、法律管辖适用及其他</p>
              <p>1、本协议的订立、执行和解释及争议的解决均应适用中国法律。如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决；协商不成时，任何一方均可向协议签订地人民法院提起诉讼。</p>
              <p>2、如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。</p>
              <p>3、本协议未明示授权的其他权利仍由昂牛商城保留，您在行使这些权利时须另外取得昂牛商城的书面许可。昂牛商城如果未行使前述任何权利，并不构成对该权利的放弃。</p>
              <p>4、本协议内容中以加粗方式显著标识的条款，请您着重阅读。您点击“同意”按钮即视为您完全接受本协议，在点击之前请您再次确认已知悉并完全理解本协议的全部内容。</p>
          </div>
          </Modal>
          
          <Modal
            width={800}
            visible={this.state.visible1}
            
            onCancel={this.handleCancel}
            footer={null}
          >
            <h3>昂牛入驻协议</h3>
            <div className='protocolUsage'>
              <p>使用本公司服务所须遵守的条款和条件。</p>
              <p>1.用户资格</p>
              <p>本公司的服务仅向适用法律下能够签订具有法律约束力的合同的个人提供并仅由其使用。在不限制前述规定的前提下，本公司的服务不向18周岁以下或被临时或无限期中止的用户提供。如您不合资格，请勿使用本 公司的服务。此外，您的账户（包括信用评价）和用户名不得向其他方转让或出售。另外，本公司保留根据其意愿中止或终止您的账户的权利。</p>
              <p>2.您的资料（包括但不限于所添加的任何商品）不得：</p>
              <p>*具有欺诈性、虚假、不准确或具误导性； *侵犯任何第三方著作权、专利权、商标权、商业秘密或其他专有权利或发表权或隐私权； *违反任何适用的法律或法规（包括但不限于有关出口管制、消费者保护、不正当竞争、刑法、反歧视或贸易惯例/公平贸易法律的法律或法规）； *有侮辱或者诽谤他人，侵害他人合法权益的内容； *有淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的内容； *包含可能破坏、改变、删除、不利影响、秘密截取、未经授权而接触或征用任何系统、数据或个人资料的任何病毒、特洛依木马、蠕虫、定时炸弹、删除蝇、复活节彩蛋、间谍软件或其他电脑程序；</p>
              <p>3.违约</p>
              <p>如发生以下情形，本公司可能限制您的活动、立即删除您的商品、向本公司社区发出有关您的行为的警告、发出警告通知、暂时中止、无限期地中止或终止您的用户资格及拒绝向您提供服务： (a)您违反本协议或纳入本协议的文件； (b)本公司无法核证或验证您向本公司提供的任何资料； (c)本公司相信您的行为可能对您、本公司用户或本公司造成损失或法律责任。</p>
              <p>4.责任限制</p>
              <p>本公司、本公司的关联公司和相关实体或本公司的供应商在任何情况下均不就因本公司的网站、本公司的服务或本协议而产生或与之有关的利润损失或任何特别、间接或后果性的损害（无论以何种方式产生，包括 疏忽）承担任何责任。您同意您就您自身行为之合法性单独承担责任。您同意，本公司和本公司的所有关联公司和相关实体对本公司用户的行为的合法性及产生的任何结果不承担责任。</p>
              <p>5.无代理关系</p>
              <p>用户和本公司是独立的合同方，本协议无意建立也没有创立任何代理、合伙、合营、雇员与雇主或特许经营关系。本公司也不对任何用户及其网上交易行为做出明示或默许的推荐、承诺或担保。</p>
              <p>6.一般规定</p>
              <p>本协议在所有方面均受中华人民共和国法律管辖。本协议的规定是可分割的，如本协议任何规定被裁定为无效或不可执行，该规定可被删除而其余条款应予以执行。</p>
            </div>
          </Modal>
      </div>
    )
  }
  //弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  showModal1 = () => {
    this.setState({
      visible1: true,
    });
  };

  handleCancel = e => {
    //console.log(e);
    this.setState({
      visible: false,
      visible1: false,
    });
  };

  //验证手机号
  checkTel(e) {
    //与表单数据进行关联
    const {validateFields} = this.props.form;
    validateFields('phone', {force: true}, err => {
        const {flag} = this.shouldGoOn();
        if(!err && !flag) {
          this.setState({isSended: true});
        } else {
          this.setState({isSended: false});
        }
    })
  }

  // 倒计时60s
  count = () => {
    let { captchaDate } = this.state;
    let timer = setInterval(() => {
      if(captchaDate <= 0){
        //倒计时( setInterval() 函数会每秒执行一次函数)，用 clearInterval() 来停止执行:
        clearInterval(timer);
        //与表单数据进行关联
        const {validateFields} = this.props.form;
        validateFields('phone', {force:true}, err => {
          if(!err) {
            this.setState({isSended: true})
          }
        })
        this.setState({captchaDate: 60,captchaStatus:false})
      }else {
        captchaDate--;
        this.setState({captchaDate});
        
      }
    },1000);
  }

  // 第一次密码的验证
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
        form.validateFields(['confirmpwd'], { force: true });
    }
    callback();
  };
  // 确认密码的验证
  compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value !== form.getFieldValue('password')) {
          callback('两次密码不一致');
      } else {
          callback();
      }
  };
  // 确认密码失焦 判断两次密码是否一直
  handleConfirmBlur = e => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  // 短信验证
  sendCode() {
    //与表单数据进行关联
    const {validateFields} = this.props.form;
    validateFields('phone', {force: true}, err => {
        if(!err){
          
          //发送验证码请求
          const {getFieldValue} = this.props.form;
          let codeData = JSON.stringify({phone: getFieldValue('phone'),code_type:'1'}) 
          
      
          api.axiosPost("getCaptcha",codeData).then((res)=>{
            //console.log(res);
            if(res.data.code === 0){
              this.setState({
                captchaStatus: false
              })
              message.info(res.data.msg)
            }else if(res.data.code === 1){
              this.setState({captchaStatus: true, isSended: false,secondText:true},() =>{
                // 存入sessionStorage
                const {getFieldValue} = this.props.form;
                sessionStorage.setItem('phone',JSON.stringify({telnumber: getFieldValue('phone'), stameTime: new Date().getTime()}))
                this.count();
              })
              message.success('验证码已发送，请注意查收')
            }
            
          })
        }else{

        }
    })
    
  }

  //表单提交
  handleSubmit = (e) =>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //发送提交请求
        let regData ={
          phone : values.phone,
          password : values.password,
          verification_code : +values.captcha
        }
        //console.log(regData);
        
        api.axiosPost('register',regData).then((res)=>{
          //console.log(res);
          if(res.data.code === 1){
            sessionStorage.setItem("token",res.data.data[0].token);
            //注册成功
            message.success('恭喜！注册成功！！')
            
            this.setState({
              tel : res.data.data[0].phone,//注册的手机号
              
            },()=>{
              //子传父
              this.props.setValues({tel : this.state.tel})
              sessionStorage.setItem("merchantsId",res.data.data[0].merchant_id);
              sessionStorage.removeItem('phone')
              //进入下一步
              this.next();
            })
          }else if(res.data.code === 0)
            //注册失败
            message.error(res.data.msg)
            
            //this.props.setValues({merchant_id : this.state.merchant_id, tel : this.state.tel})
            //this.next();
        })
        
      }else{
        return;
      }
    });
  } 
}

export default Form.create()(Reg);