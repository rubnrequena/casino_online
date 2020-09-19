module.exports = {
  regexec(str, regex) {
    let m;
    let result = [];
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      result.push(m.groups);
    }
    return result;
  },
};
