<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * User
 *
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 * @UniqueEntity("email")
 */
class User
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="email", type="string", length=255, unique=true)
     * @Assert\Email()
     * @Assert\NotBlank(message = "Please enter valid email address")
     */
    private $email;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created", type="datetime")
     */
    private $created;

   /**
    * @Assert\NotBlank(message = "Please enter character name")
   */
    private $characterName;


    /**
     * One Use has One Character.
     * @ORM\OneToOne(targetEntity="Characters", mappedBy="user")
     */
    private $character;


    public function __construct()
    {
        $this->created = new \DateTime();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set created
     *
     * @param \DateTime $created
     *
     * @return User
     */
    // public function setCreated($created)
    // {
    //     $this->created = $created;

    //     return $this;
    // }

    /**
     * Get created
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

     /**
     * Set created
     *
     * @param \Character $use
     *
     * @return Character
     */
    public function setCharacter(Characters$character)
    {
        $this->character = $character;

        return $this;
    }

    /**
     * Get created
     *
     * @return Character
     */
    public function getCharacter()
    {
        return $this->character;
    }

     /**
     * Set email
     *
     * @param string $email
     *
     * @return User
     */
    public function setCharacterName($characterName)
    {
        $this->characterName = $characterName;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getCharacterName()
    {
        return $this->characterName;
    }
}

