function checkPalindrome(num) {
    if (typeof num !== "number" || !Number.isFinite(num) || num < 0) {
        console.log("number.");
        return false;
    }
    const str = num.toString();
    const reversed = str.split("").reverse().join("");
    const isPalindrome = str === reversed;
    console.log(isPalindrome ? "Palindrome" : "Not a palindrome");
    return isPalindrome;
}
checkPalindrome(121);
checkPalindrome(20);
