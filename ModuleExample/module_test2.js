// Reason : exports는 속성으로, exports에 속성을 추가하면 모듈에서 접근하지만
// exports에 객체를 지정하면 자바스크립트에서 새로운변수로 처리함
// 결국 아무 속성도 없는 {} 객체가 반환됨
var user = require('./user2');

console.dir(user);

function showUser() {
    return user.getUser().name + ', ' + user.group.name;
}

console.log(showUser());