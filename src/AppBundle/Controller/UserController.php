<?php

namespace AppBundle\Controller;

use AppBundle\Entity\User;
use AppBundle\Entity\Characters;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

/**
 * User controller.
 *
 * @Route("user")
 */
class UserController extends Controller
{
    
    /**
     * Creates a new user entity.
     *
     * @Route("/new", name="user_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $session = new Session();
        if($session->get('user_id')) {                   // check users session already started. if session started then redirect user on game page 
            return $this->redirectToRoute('game');
        }
        $user = new User();
        $form = $this->createForm('AppBundle\Form\UserType', $user);  // new user form.
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if($this->saveUserAndCharacter($user)) {
                $this->setUserSessionData($user);       // set users session data and redirect on game page 
                return $this->redirectToRoute('game');
            }
        }
        return $this->render('user/new.html.twig', array(
            'user' => $user,
            'form' => $form->createView(),
        ));
    }

    /**
     * Get user and characters by email.
     * @Route("/get", name="user_get")
     * @Method({"GET", "POST"})
     */
    public function getAction(Request $request )
    {
        $session = new Session();
        if($session->get('user_id')) { // check users session already started. if session started then redirect user on game page 
            return $this->redirectToRoute('game');
        }
        $user = new User();
        $form = $this->createForm('AppBundle\Form\GetUserType', $user);
        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            $em = $this->getDoctrine()->getManager();
            $userData = $em->getRepository('AppBundle:User')->findOneBy(array('email'=>$user->getEmail()));
            if(!empty($userData)) { 
                $this->setUserSessionData($userData);
                return $this->redirectToRoute('game');
            }
            $this->addFlash('error', 'Invalid email address');   // if user not present 
        }
        return $this->render('user/get.html.twig', array(
            'form' => $form->createView(),
        ));
    }


    /**
    * set users data in session
    */
    private function setUserSessionData($userData) {
        if(!empty($userData)) {
                $session = new Session();
                $session->set('user_id', $userData->getId());  // set username in session
                $session->set('user_email', $userData->getEmail()); // set email in session 
        }
    }

    /**
    *create new user with character 
    */
    private function saveUserAndCharacter(&$user)
    {
        $em = $this->getDoctrine()->getManager();
        $em1 = $this->getDoctrine()->getManager();
        $characterData = $em1->getRepository('AppBundle:Characters')->findOneBy(array('name'=>$user->getCharacterName()));
        if(!empty($characterData)){
            $this->addFlash('error','Character with provided name already exists');
            return false;
        }
        $em->getConnection()->beginTransaction();
        $em1->getConnection()->beginTransaction();
        $em->persist($user);
        $em->flush($user);  // save user 
        $character = new Characters();
        $character->setName($user->getCharacterName());
        $character->setUser($user);
        $character->setIsBot(false);
        $character->setScore(0);
        $character->setLevel(1);  // set default values 
        $em1->persist($character);
        $em1->flush($character);  // save character 
        $em->getConnection()->commit();
        $em1->getConnection()->commit();               // commit transactio  only both user and character entities getting saved successsfully 
        $this->addFlash('notice','Character created successfully');
        return true;
    }
}
