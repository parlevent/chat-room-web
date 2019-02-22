<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">Chat Room</div>
                    <div class="layout-nav">
                        <p style="text-align: right">{{ username }}</p>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger
                       :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto', background: '#fff'}">
                    <Card>当前共{{onlineUsers.length}}人在线</Card>
                    <Menu :active-name="receiver" @on-select="choose_receiver" theme="light" width="auto">
                        <!--<MenuItem name="1">User 1</MenuItem>-->
                        <!--<MenuItem name="2">User 2</MenuItem>-->
                        <!--<MenuItem name="3">User 3</MenuItem>-->
                        <!--<MenuItem name="4">User 4</MenuItem>-->
                        <MenuItem v-for="user in onlineUsers" :name="user">{{user}}</MenuItem>

                    </Menu>
                </Sider>
                <Layout :style="{ marginLeft: '200px', height: '100%'}">
                    <Content :style="{padding: '24px', height: '100vh', background: '#fff', textAlign: 'left'}">
                        <div class="msg-display" v-html="messages"></div>
                        <div class="msg-op">
                            <Row type="flex" align="bottom">
                                <i-col span="22">
                                    <i-input v-model="input_msg" type="textarea" :autosize="{minRows: 1,maxRows: 5}"
                                             placeholder="Enter something..."/>
                                </i-col>
                                <i-col span="2" :style="{textAlign: 'center'}">
                                    <i-button type="primary" @click="sendMsg"
                                              :disabled="input_msg === '' || receiver === null || receiver === ''">发送
                                    </i-button>
                                </i-col>
                            </Row>


                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>

<script>

    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'

    import axios from 'axios'
    import global from '../global'

    export default {
        name: "Chat",

        data() {
            return {
                username: "traveller",
                receiver: "",
                input_msg: "",
                stompClient: null,
                messages: "",
                onlineUsers: []
            }
        },

        methods: {
            sendMsg: function () {
                this.stompClient.send("/app/sendMsg", {}, JSON.stringify({
                    sender: this.username,
                    receiver: this.receiver,
                    content: this.input_msg
                }));
                this.messages += this.wrapMsg("我", this.input_msg);
                this.input_msg = "";
            },

            choose_receiver: function (name) {
                if (name !== this.receiver) {
                    this.receiver = name;
                    this.messages = "";
                }
            },

            wrapMsg: function (user, msg) {
                return "<p>" + user + "</p><p>" + msg + "</p><br/>";
            }
        },

        mounted: function () {
            if ("username" in this.$route.params) {
                this.username = this.$route.params.username;
                this.onlineUsers.push(this.username);
            }
            let socket = new SockJS(global.endpoints.socket);
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, () => {
                console.log("Connect successfully!");

                this.stompClient.subscribe('/user/' + this.username + '/msg', (data) => {
                    console.log("received: " + JSON.parse(data.body).content);
                    let obj = JSON.parse(data.body);
                    this.messages += this.wrapMsg(obj.sender, obj.content);
                });

                this.stompClient.subscribe("/topic/broadcastMsg", data => {
                    this.messages += JSON.parse(data.body).content;
                    let obj = JSON.parse(data.body);
                    this.messages += this.wrapMsg("【管理员消息】" + obj.sender, obj.content);
                });

                this.stompClient.subscribe("/topic/login", data => {
                    // let strArr = data.body.substr(1, data.body.length - 2);
                    // let arr = strArr.split(',');
                    // arr = arr.map(item => {
                    //     return item.substr(1, item.length - 2);
                    // });
                    // console.log(arr);
                    // this.onlineUsers = arr;
                    this.onlineUsers = global.convertSetStrToList(data.body);
                });
            });

            axios.get(global.endpoints.onlineUsers).then(response => {
                console.log(response);
                // this.onlineUsers = global.convertSetStrToList(response);
                this.onlineUsers = response.data;
            });
        }
    }
</script>

<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;

        height: 100%;
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        /*background: #5b6270;*/
        /*border-radius: 3px;*/
        float: left;
        position: relative;
        /*top: 15px;*/
        /*left: 20px;*/
        color: #f5f7f9;
    }

    .layout-nav {
        width: 420px;
        float: right;
        color: #f5f7f9;
        margin: 0 auto;
        margin-right: 20px;
    }

    .msg-display {
        height: 70%;
        padding-bottom: 0px;
        /*margin-bottom: 100px;*/
        overflow: auto;
    }

    .msg-op {
        height: 30%;
        margin-top: 20px;
        overflow: hidden;
    }

</style>