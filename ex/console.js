/*
전역 객체란?
프로그램 전체에서 사용할 수 있는 객체 (ex. console, export, process..) ...Node.js 가 제공.
 */
var sum = 0;
const code = 5;

// time과 timeEnd 사이의 시간 측정시 사용. (성능테스트 할 수 있음)
console.time('실행시간');
for (var cnt = 0; cnt < 100; cnt++) {
    sum = sum + cnt;
}
console.timeEnd('실행시간');

console.log("반복횟수: %d", cnt);
console.log("반복횟수: ", cnt);
console.log(cnt);

console.log(`반복횟수와 총합계: ${ cnt + sum }`);
console.log("%d, %s, %j", sum," 그리고,", {age: 24});
console.error('error #%d', code);