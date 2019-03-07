import React, {Component} from 'react';
import mqtt from 'mqtt';

const MQTT = {
	URL: 'mqtts://xxxx.xxx', // "mqtt://xxxxx.xxx"
	OPTIONS: {
		port: 443, //1883
		clientId: "clientID",
		username: "username",
		password: "password",
		keepalive: 60,
		reconnectPeriod: 1000,
		protocolId: "MQIsdp",
		protocolVersion: 3,
		clean: true,
	}
}

class App extends Component {

	_mqttItvID = null;

	constructor(props){
		super(props);
		this.state = {
			mqttClient: null,
			topic: null,
		}
	}

	componentDidMount(){
		
		this.mqttConnect();

		this._mqttItvID = setInterval(()=>{
            if(this.state.mqttClient){
                this.mqttSubscribe();
				clearInterval(this._mqttItvID);
				this._mqttItvID = null;
            }
        }, 1000);

	}

	mqttConnect(){
		const options = MQTT.OPTIONS;
        const mqttClient = mqtt.connect(MQTT.URL, options);
        const that = this;
        mqttClient.on('connect', function () {
            console.log('mqtt server connected');
            that.setState({
				mqttClient: mqttClient
			})
		})
	}

	mqttSubscribe(){
		const topic = "here topic"
		this.setState({
			topic: topic
		})
        
        this.state.mqttClient.subscribe(topic, function (error) {
            if (error !== null) {
                console.log(`mqtt subscribe error with topic "${topic}"`, error)
            }else{
                console.log(`mqtt subscribed with topic "${topic}"`);
            }
        })
        this.mqttMessage();
    }

    mqttMessage(){
        const that = this;
        this.state.mqttClient.on('message', function (topic, message) {
            if(topic === that.state.topic){
                const updatedData = JSON.parse(message.toString());
                console.log("MESSAGE: \n", updatedData);
            }
		})
    }

    mqttUnsubscribe(){
        this.state.mqttClient.unsubscribe(this.state.topic, function (error) {
            if (error !== null) {
                console.log(`mqtt DBP1 topic unubscribe error.`, error)
            }else{
                console.log(`mqtt DBP1 topic unsubscribed`);
            }
		})
    }

	componentWillUnmount(){
        if (this.state.mqttClient && this.state.topic){

			this.mqttUnsubscribe();

            // mqtt client end
            this.state.mqttClient.on('end', (error) => {
                if(error){
                    console.log('Mqtt client end.', error);
                }else{
                    console.log('Mqtt client end.');
                }
            })

            //mqtt connect close
            this.state.mqttClient.on('close', function (error) {
                if(error){
                    console.log('Mqtt connect closed.', error);
                }else{
                    console.log('Mqtt connect closed.');
                }
            })
		}
		
		if(this._mqttItvID){
			clearInterval(this._mqttItvID);
			this._mqttItvID = null;
		}
    }
    

	render() {
		return (
			<div></div>
		);
	}
}

export default App;