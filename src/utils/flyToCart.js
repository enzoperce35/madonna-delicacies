let current = null // the flight in progress, if any

// Flies one reusable photo from the tapped row into the bag, then calls onLand()
export function flyToCart(sourceEl, image, onLand) {
  const dot = document.getElementById('fly-dot')
  const target = document.getElementById('cart-button')
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // A new tap lands the previous flight right away, so there is only ever one
  if (current) current.finish()

  // No animation possible: just add the item
  if (!dot || !target || !sourceEl || reduceMotion || typeof dot.animate !== 'function') {
    onLand()
    return
  }

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()

  const size = 44
  const startX = from.right - 40
  const startY = from.top + from.height / 2
  const dx = to.left + to.width / 2 - startX
  const dy = to.top + to.height / 2 - startY

  dot.style.left = `${startX - size / 2}px`
  dot.style.top = `${startY - size / 2}px`
  dot.style.backgroundImage = image ? `url("${image}")` : 'none'
  dot.style.display = 'block'

  const animation = dot.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 70}px) scale(0.95)`,
        opacity: 1,
        offset: 0.45,
      },
      { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.7 },
    ],
    { duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' }
  )

  let done = false
  const flight = {
    finish() {
      if (done) return
      done = true
      dot.style.display = 'none'
      animation.cancel()
      if (current === flight) current = null
      onLand()
    },
  }

  current = flight
  animation.onfinish = flight.finish
  setTimeout(flight.finish, 1000) // safety net if the browser never reports "finished"
}
