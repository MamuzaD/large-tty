;(function () {
  var theme = 'dark'
  var themeColors = {
    dark: 'rgb(13, 13, 20)',
    light: 'rgb(250, 250, 250)',
  }
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

  var themeColor = document.querySelector('meta[name="theme-color"]')
  if (themeColor) {
    themeColor.setAttribute('content', themeColors[theme])
  }
})()
