var sum = 0;
const code = 5;

// console.time ~ console.timeEnd까지의 "실행시간: 1ms" 출력.
console.time('실행시간');
for (var cnt = 0; cnt < 100; cnt++) {
    sum = sum + cnt;
}
console.timeEnd('실행시간');

console.log("반복횟수: %d", cnt);
console.log('반복횟수: ', cnt);
console.log(cnt);
console.log(`반복횟수와 총합계: ${ cnt + sum }`);

// %d = sum, %s = "그리고, ", %j = { age:24 }
console.log("%d, %s, %j", sum, "그리고, ", { age: 24 });
console.error('error #%d', code);