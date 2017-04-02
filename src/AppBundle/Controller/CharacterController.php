<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\User;
use AppBundle\Entity\Characters;
use Symfony\Component\HttpFoundation\Response;

class CharacterController extends Controller
{
    /**
     * @Route("/character/updatedata", name="update_data")
     */
    public function updateDataAction(Request $request)
    {
        if($request->isXmlHttpRequest()) {
            $response  = new Response();
            $session = new Session();
            if(!$session->get('user_id')) {
                 return $response->setContent(json_encode(array(
                 'error' => 1,
                 'message' => "Invalid request"
                  )));
            }

            $data = $request->request->get('data');
            if(!empty($data)) {
                 $em = $this->getDoctrine()->getManager();
                 $character = $em->getRepository('AppBundle:Characters')->findOneBy(array('userId'=> $session->get('user_id')));
                 if(isset($data['level'])) {
                    $character->setLevel($data['level']);
                 }
                 else if(isset($data['score'])){
                    $character->setScore($data['score']);
                 }
                 $em->flush();
                 return $response->setContent(json_encode(array(
                   'success' => 1,
                   'message' => "Score updated succesfully"
                 )));
            }
            return $response->setContent(json_encode(array(
                   'error' => 1,
                   'message' => "Data not provided"
                 )));
            
        } else {
            return $this->redirect($this->generateUrl('/'));
        }
    }

}