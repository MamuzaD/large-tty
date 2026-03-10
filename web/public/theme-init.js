;(function () {
  var theme = 'dark'
  try {
    var raw = localStorage.getItem('large-tty-settings')
    if (raw) {
      var parsed = JSON.parse(raw)
      if (parsed && (parsed.theme === 'dark' || parsed.theme === 'light')) {
        theme = parsed.theme
      }
    }
  } catch (_) {
    // noop
  }

  var root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
})()
