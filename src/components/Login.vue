<template>
    <div id="login-card">
        <Row type="flex" justify="center">
            <div style="width: 300px;">
                <Card>
                    <p slot="title">欢迎登录</p>
                    <div>
                        <Form ref="formInline" :model="formInline" :rules="ruleInline">
                            <FormItem prop="user">
                                <Input type="text" v-model="formInline.user" placeholder="用户名">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input type="password" v-model="formInline.password" placeholder="密码">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>
        </Row>


    </div>

</template>

<script>
    import axios from 'axios'
    import global from '../global.js'

    axios.defaults.headers.post['Content-Type'] = 'application/json';

    export default {
        name: "Login",

        data() {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '最少为6个字符', trigger: 'blur'}
                    ]
                }
            }
        },

        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        axios.post(global.endpoints.login, JSON.stringify({
                            username: this.formInline.user,
                            password: this.formInline.password
                        })).then(response => {
                            if (response.status === 200 && response.data.status) {
                                this.$router.push({name: "Chat", params: {username: this.formInline.user}});
                                this.$Message.success('登录成功!');
                            } else {
                                this.$Message.error('用户名或密码错误，请重试！');
                                // alert(axios.defaults.headers.post['Content-Type'])
                            }
                        });
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style scoped>

    #login-card {
        margin-top: 60px;
    }

</style>