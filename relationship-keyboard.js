(function () {
  var answer = document.getElementById("studentAnswer");
  var next = document.getElementById("next");

  answer.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("check").click();
    }
  });

  next.addEventListener("click", function () {
    answer.focus();
  });
})();
