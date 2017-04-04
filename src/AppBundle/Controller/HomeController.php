<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\User;
use AppBundle\Entity\Characters;

class HomeController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render('Home/index.html.twig');
    }

     /**
     * @Route("/game", name="game")
     */
    public function gameAction(Request $request)
    {
        $session = new Session();
        if(!$session->get('user_id')) {  // if user try to come directly on game page 
            $this->addFlash('error', 'Please enter your email address');
            return $this->redirectToRoute('user_get');
        }
        $em = $this->getDoctrine()->getManager();
        $character = $em->getRepository('AppBundle:Characters')->findOneBy(array('userId'=>$session->get('user_id')));   // get current users character name 
        $topScorers = $em->getRepository('AppBundle:Characters')->findBy(array(),array('score'=> 'DESC'),$this->container->getParameter('top_score_limit'));           // get top scorers 
        return $this->render('Home/game.html.twig',  array(
            'character' => $character,
            'topScorers'  => $topScorers
        ));
    }
     /**
     * @Route("/game/stop", name="stop_game")
     */
    public function stopAction(Request $request)
    {
        $session = new Session();
        if(!$session->get('user_id')) {
            $this->addFlash('error', 'Please enter your email address');
            return $this->redirectToRoute('homepage');
        }
        $session->remove('user_id');            // destroy users session data.
        $session->remove('user_email');
        return $this->redirectToRoute('homepage');

    }
}
