
 /* jQuery Pre loader
  -----------------------------------------------*/
$(window).load(function(){
    loader() // set duration in brackets    
});

function loader()
{
    $('.loader').fadeOut(1000)
    $('.preloader').fadeOut(1000)
}
$(function() {
   /* Back top
  -----------------------------------------------*/
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
        $('.go-top').fadeIn(200);
        } else {
          $('.go-top').fadeOut(200);
        }
        });   
        // Animate the scroll to top
      $('.go-top').click(function(event) {
        event.preventDefault();
      $('html, body').animate({scrollTop: 0}, 300);
      })
  });