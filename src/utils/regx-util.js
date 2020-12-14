module.exports = {
  regexec(str, regex, one) {
    let m;
    let result = [];
    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (m.groups) result.push(m.groups);
      else result.push(m)
    }
    if (one) return result[0]
    return result;
  },
};
