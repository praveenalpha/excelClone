const { ajaxPrefilter } = require("jquery");

class Stack{
    constructor(){
        this.arr = [];
    }
    Push(ele){
        this.arr.push(ele);
    }
    Pop(){
        this.arr.pop();
    }
    Size(){
        return this.arr.length;
    }
    Top(){
        return this.arr[this.arr.length-1];
    }
}
function precedence(ch){
    if(ch == '+'){
        return 1;
    }
    else if(ch == '+'){
        return 1;
    }
    else if(ch == '*'){
        return 2;
    }
    else if(ch == '/'){
        return 2;
    }
    else if(ch == '^'){
        return 3;
    }
}
function solve(v1,v2,op){
    if(op == '*'){
        return v1 * v2;
    }
    else if(op == '/'){
        return v1 / v2;
    }
    else if(op == '+'){
        return v1 + v2;
    }
    else if(op == '-'){
        return v1 - v2;
    }
}
function infixEvaluaton(expr){
    let operatorStack = new Stack();
    let charecterStack = new Stack();
    for(let i = 0;i<expr.length;i++){
        if(expr[i] == '('){
            operatorStack.Push('(');
        }
        else if(expr[i] == ')'){
            while(operatorStack.Top() != '('){
                let op = operatorStack.Top();
                operatorStack.Pop();
                let value2 = charecterStack.Top() - '0';
                charecterStack.Pop();
                let value1 = charecterStack.Top() - '0';
                charecterStack.Pop();
                let ans = solve(value1,value2,op);
                charecterStack.Push(ans);
            }
            operatorStack.Pop();
        }
        else if(expr[i] >= '0' && expr[i] <= '9'){
            let num = expr[i] - '0';
            charecterStack.Push(num);
        }
        else{
            let precedenceOfCurrChar = precedence(expr[i]);
            while(operatorStack.Size() != 0 && operatorStack.Top() != '(' && precedenceOfCurrChar <= precedence(operatorStack.Top())){
                let op = operatorStack.Top();
                operatorStack.Pop();
                let value2 = charecterStack.Top() - '0';
                charecterStack.Pop();
                let value1 = charecterStack.Top() - '0';
                charecterStack.Pop();
                let ans = solve(value1,value2,op);
                charecterStack.Push(ans);
            }   
            operatorStack.Push(expr[i]);
        }
        
    }
    return operatorStack.Top();
}
let expr = ( 1 + 2 );
let ans = infixEvaluaton(expr);
console.log(ans);