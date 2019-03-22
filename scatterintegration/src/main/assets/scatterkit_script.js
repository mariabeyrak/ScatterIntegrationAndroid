function _sendScatterSimulationRequest(t,e){return navigator.userAgent===SP_USER_AGENT_ANDROID?WebView.pushMessage(JSON.stringify({params:t,methodName:e})):navigator.userAgent===SP_USER_AGENT_IOS&&window.webkit.messageHandlers.pushMessage.postMessage(JSON.stringify({params:t,methodName:e})),callbackResult(e)}function callbackResult(t){return new Promise((e,n)=>{window[t]=function(t){e(JSON.parse(t))}})}class ScatterSimulation{constructor(){}requestMsgSignature(t){return _sendScatterSimulationRequest(t,'callbackRequestMsgSignature')}requestSignature(t){return _sendScatterSimulationRequest(t,'callbackRequestSignature')}getAppInfo(){return _sendScatterSimulationRequest('','callbackGetAppInfo')}walletLanguage(){return _sendScatterSimulationRequest('','callbackWalletLanguage')}getEosAccount(){return console.log('--- entered the getEosAccount ---'),_sendScatterSimulationRequest('','callbackGetEosAccount')}getWalletWithAccount(){return _sendScatterSimulationRequest('','callbackGetWalletWithAccount')}getEosBalance(t){return _sendScatterSimulationRequest(JSON.stringify(t),'callbackGetEosBalance')}getEosAccountInfo(t){return _sendScatterSimulationRequest(JSON.stringify(t),'callbackGetEosAccountInfo')}getTransactionById(t){return _sendScatterSimulationRequest(JSON.stringify(t),'callbackGetTransactionById')}pushActions(t){t.serialNumber;return _sendScatterSimulationRequest(JSON.stringify(t),'callbackPushActions')}pushTransfer(t){t.serialNumber;return _sendScatterSimulationRequest(JSON.stringify(t),'callbackPushTransfer')}}const ss=new ScatterSimulation,Blockchains={EOS:'eos',ETH:'eth',TRX:'trx'};class Network{constructor(t='',e='https',n='',r=0,s=Blockchains.EOS,i=''){this.name=t,this.protocol=e,this.host=n,this.port=r,this.blockchain=s,this.chainId=i.toString()}static placeholder(){return new Network}static fromJson(t){const e=Object.assign(Network.placeholder(),t);return e.chainId=e.chainId?e.chainId.toString():'',e}isValid(){return this.protocol.length&&this.host.length&&this.port||this.chainId.length}hostport(){return`${this.host}${this.port?':':''}${this.port}`}}const BLOCKCHAIN_SUPPORT='blockchain_support';class Plugin{constructor(t='',e=''){this.name=t,this.type=e}static placeholder(){return new Plugin}static fromJson(t){return Object.assign(Plugin.placeholder(),t)}isSignatureProvider(){return this.type===BLOCKCHAIN_SUPPORT}}class PluginRepositorySingleton{constructor(){this.plugins=[]}loadPlugin(t){this.plugin(t.name)||this.plugins.push(t)}signatureProviders(){return this.plugins.filter(t=>t.type===BLOCKCHAIN_SUPPORT)}supportedBlockchains(){return this.signatureProviders().map(t=>name)}plugin(t){return this.plugins.find(e=>e.name===t)}async endorsedNetworks(){return await Promise.all(this.signatureProviders().map(async t=>await t.getEndorsedNetwork()))}}const PluginRepository=new PluginRepositorySingleton,throwNoAuth=()=>{},checkForExtension=(t,e=0)=>{if(!(e>20))return window.scatter.isExtension?t(!0):void setTimeout(()=>checkForExtension(t,e+1),100)};class IdentityScatterSimulation{constructor(t){this.hash='db4960659fb585600be9e0ec48d2e6f4826d6f929c4bcef095356ce51424608d',this.publicKey='EOS5rJZvudjCmunqGd2PtfQTYiYRaQPzb82yXnw5FGjZN3waHrQSY',this.name='EOS_SCATTER_SIMULATION',this.accounts=[{name:t,authority:'active',blockchain:'eos'}],this.kyc=!1}}class Index{constructor(){console.log('--- entered the Index ---'),this.isExtension=!0,this.identity=null}loadPlugin(t){const e=()=>{if(!this.identity)throw new Error('No Identity')};PluginRepository.loadPlugin(t),t.isSignatureProvider()&&(this[t.name]=t.signatureProvider(e),this[t.name+'Hook']=t.hookProvider)}async isInstalled(){return new Promise(t=>{setTimeout(()=>{t(!1)},3e3),Promise.race([checkForExtension(t)])})}async connect(t,e){return new Promise(n=>{if(!t||!t.length)throw new Error('You must specify a name for this connection');e=Object.assign({initTimeout:1e4,linkTimeout:3e4},e),setTimeout(()=>{n(!1)},e.initTimeout),checkForExtension(n)})}disconnect(){}getIdentity(t){return throwNoAuth(),new Promise((t,e)=>{ss.getEosAccount().then(e=>{var n=e.data;const r=new IdentityScatterSimulation(n);this.identity=r,t(r)})})}getIdentityFromPermissions(){return throwNoAuth(),new Promise((t,e)=>{ss.getEosAccount().then(e=>{var n=e.data;const r=new IdentityScatterSimulation(n);this.identity=r,t(r)})})}forgetIdentity(){return throwNoAuth(),new Promise((t,e)=>{this.identity=null,t(!0)})}authenticate(t){return throwNoAuth(),new Promise((t,e)=>{ss.getEosAccount().then(e=>{var n=e.data;const r=new IdentityScatterSimulation(n);this.identity=r,t(r)})})}getArbitrarySignature(t,e,n='',r=!1){let s={publicKey:t,data:e,whatfor:n,isHash:r};return new Promise((t,e)=>{let n,r=JSON.stringify(s);ss.requestMsgSignature(r).then(e=>{n=e.data,t(n)})})}getPublicKey(t){return throwNoAuth(),0}linkAccount(t,e){return throwNoAuth(),0}hasAccountFor(t){return throwNoAuth(),0}suggestNetwork(t){return throwNoAuth(),0}requestTransfer(t,e,n,r={}){return 0}requestSignature(t){return throwNoAuth(),0}createTransaction(t,e,n,r){return throwNoAuth(),0}}const proxy=(t,e)=>new Proxy(t,e);let cache={};class ScatterEOS extends Plugin{constructor(){super(Blockchains.EOS,BLOCKCHAIN_SUPPORT)}signatureProvider(...t){const e=t[0];return(t,n,r={})=>{if(!(t=Network.fromJson(t)).isValid())throw Error.noNetwork();const s=`${t.protocol}`+'://'+`${t.hostport()}`,i=t.hasOwnProperty('chainId')&&t.chainId.length?t.chainId:r.chainId;return proxy(n({httpEndpoint:s,chainId:i}),{get(t,o){console.log('method',o,t);let a=null;return(...t)=>{if(t.find(t=>t.hasOwnProperty('keyProvider')))throw Error.usedKeyProvider();const c=async n=>{e();t.find(t=>t.hasOwnProperty('requiredFields'));var r='';await ss.requestSignature(JSON.stringify(n)).then(t=>(r=t.data.signData,''));if(!r)return null;if(r.hasOwnProperty('signatures')){a=r.returnedFields;let e=t.find(t=>t.hasOwnProperty('signProvider'));return e&&r.signatures.push(e.signProvider(n.buf,n.sign)),r.signatures}return r};return new Promise((e,u)=>{n(Object.assign(r,{httpEndpoint:s,signProvider:c,chainId:i}))[o](...t).then(t=>{if(!t.hasOwnProperty('fc'))return t=Object.assign(t,{returnedFields:a}),void e(t);const n=proxy(t,{get:(t,e)=>'then'===e?t[e]:(...n)=>new Promise(async(r,s)=>{t[e](...n).then(t=>{r(Object.assign(t,{returnedFields:a}))}).catch(s)})});e(n)}).catch(t=>u(t))})}}})}}}function inject(){console.log('--- entered the inject ---'),window.scatter=new Index,window.scatter.loadPlugin(new ScatterEOS),document.dispatchEvent(new CustomEvent('scatterLoaded'))}inject();