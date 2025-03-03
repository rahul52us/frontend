import {
  Box,
  Divider,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter, ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import Image from "next/image";
import { JSX, useState } from 'react';
import '../../FAQ/FAQAccordion/scroll.css';

type ConditionDetails = {
  description: string;
  CommonSymptoms?: string[];
  treatmentOptions?: string[]; // Add this line to include 'treatmentOptions'
  keyStatistics?: string[];
};

type DetailSectionProps = {
  title: string | JSX.Element;  // icon: React.ElementType;
  children: React.ReactNode;
};

const MentalHealthConditions = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('#065F68', 'teal.200');

  const conditionDetails: Record<string, ConditionDetails> = {
    "Depression": {
      description: "Depression is more than just feeling sad—it’s a serious condition that affects how you think, feel, and act. It can make daily life hard, draining your energy, motivation, and joy. But depression is treatable, and with the right help, people can feel better.",
      CommonSymptoms: [
        "Persistent sad or empty mood",
        "Loss of interest in activities",
        "Significant weight changes",
        "Sleep disturbances",
        "Fatigue or loss of energy",
        "Feelings of worthlessness",
        "Difficulty concentrating"
      ],
      treatmentOptions: [
        "Antidepressant medications (SSRIs/SNRIs)",
        "Psychotherapy (CBT, IPT)",
        "Transcranial Magnetic Stimulation (TMS)",
        "Lifestyle changes (exercise, nutrition)",
        "Mindfulness-Based Cognitive Therapy"
      ],
      keyStatistics: ["Affects over 280 million people worldwide (WHO 2023)"]
    },
    "Anxiety": {
      description: "Anxiety is a feeling of worry, fear, or nervousness that can be mild or intense. It becomes a problem when it happens too often, is hard to control, and affects daily life. Generalized Anxiety Disorder (GAD) is one of the most common types, where a person worries excessively for months.",
      CommonSymptoms: [
        "Feeling restless or on edge",
        "Getting tired easily",
        "Trouble focusing or feeling like your mind goes blank",
        "Feeling irritable or frustrated",
        "Muscle tension, aches, or stiffness",
        "Sleep problems, like trouble falling asleep or staying asleep"
      ],
    },
    "Stress": {
      description: "Stress is how your body reacts to challenges or demands. It can be caused by work, relationships, or daily life pressures. While some stress is normal, too much can harm your health.",
      CommonSymptoms: [
        "Feeling anxious, restless, or overwhelmed",
        "Trouble sleeping or constant fatigue",
        "Headaches, muscle tension, or stomach issues",
        "Difficulty focusing or feeling easily irritated"
      ],
    },
    "Relationship": {
      description: "Relationship distress happens when couples struggle with ongoing conflict, emotional distance, or lack of communication. It can lead to frustration, sadness, and feelings of loneliness. Many factors, like stress, unmet needs, or past experiences, can contribute to these difficulties.",
      CommonSymptoms: [
        "Frequent arguments or unresolved conflicts",
        "Feeling emotionally disconnected or distant",
        "Decreased intimacy or affection",
        "Increased stress, anxiety, or sadness in the relationship",
        "Difficulty communicating or feeling misunderstood"
      ],
      treatmentOptions: [
        "Couples counseling",
        "Improving communication skills",
        "Identifying and addressing underlying issues",
        "Building trust and intimacy"
      ],
    },
    "Anger": {
      description: "Anger is a natural emotion, but when it becomes intense, frequent, or hard to control, it can harm relationships, work, and mental health. It often comes from frustration, stress, past trauma, or feeling misunderstood. Unmanaged anger can lead to regret, guilt, and even health problems like high blood pressure.",
      CommonSymptoms: [
        "Feeling easily irritated or frustrated",
        "Explosive outbursts or difficulty calming down",
        "Physical signs like a racing heart or clenched jaw",
        "Holding in anger until it builds up and explodes",
        "Feeling regret or guilt after getting angry"
      ],
    },
    "Loneliness": {
      description: "Loneliness is the painful feeling of being disconnected from others, even when people are around. It’s not just about being alone—it’s about feeling unseen, unheard, or misunderstood. Long-term loneliness can lead to stress, anxiety, and even physical health problems. It often comes from major life changes, loss, or difficulty forming close relationships.",
      CommonSymptoms: [
        "Feeling isolated even in a crowd",
        "Struggling to connect or form meaningful relationships",
        "Lack of motivation or interest in social activities",
        "Increased sadness, anxiety, or low self-worth",
        "Physical symptoms like fatigue or trouble sleeping"
      ]
    },
    "OCD": {
      description: "Obsessive-Compulsive Disorder (OCD) is a mental health condition where people experience obsessions (intrusive, distressing thoughts) and compulsions (repetitive behaviors or mental rituals to ease anxiety). These symptoms can be overwhelming and interfere with daily life. OCD is more than just liking things neat—it’s a serious condition that requires proper treatment.",
      CommonSymptoms: [
        "Fear of contamination (germs, illness)",
        "Unwanted violent, religious, or sexual thoughts",
        "Excessive doubt (Did I lock the door? Did I offend someone?)",
        "Need for things to be “just right”",
        "Excessive washing, cleaning, or checking things",
        "Repeating words, counting, or arranging objects in a certain way",
        "Avoiding triggers or mentally neutralizing thoughts"
      ],
    },
    "Trauma and Loss": {
      description: "Losing someone or experiencing a traumatic event can deeply impact emotions, thoughts, and daily life. Grief is a natural response to loss, while trauma can leave lasting emotional scars. Both can bring intense sadness, confusion, or even numbness. The healing process looks different for everyone, and it takes time to adjust and find ways to cope.",
      CommonSymptoms: [
        "Deep sadness, emptiness, or feeling numb",
        "Waves of intense emotion, sometimes triggered unexpectedly",
        "Guilt, regret, or wishing things had happened differently",
        "Trouble sleeping, eating, or focusing on daily tasks",
        "Withdrawing from others or struggling to find meaning in life"
      ]
    },
    "Self-Esteem": {
      description: "Self-esteem is how we see and value ourselves. When it’s low, people often feel unworthy, not good enough, or doubt their abilities. It can be shaped by life experiences, relationships, and societal pressures. Struggling with self-esteem can lead to anxiety, depression, or difficulty setting boundaries, but with effort, it can improve.",
      CommonSymptoms: [
        "Constant self-criticism or feeling like a failure",
        "Comparing yourself to others and feeling inferior",
        "Struggling to accept compliments or feeling unworthy of success",
        "Fear of rejection, people-pleasing, or difficulty saying 'no'",
        "Avoiding challenges due to fear of failure"
      ]
    },
    "ADHD": {
      description: "ADHD is a brain condition that makes it hard to focus, stay organized, and control impulses. It often starts in childhood but can continue into adulthood, affecting work, relationships, and daily life. ADHD looks different for everyone—some struggle with focus, while others are more impulsive or restless.",
      CommonSymptoms: [
        "Easily distracted, forgetful, or struggling to finish tasks",
        "Getting stuck in activities you enjoy but ignoring other responsibilities",
        "Messy spaces, procrastination, and trouble keeping track of things",
        "Acting or speaking without thinking, interrupting others",
        "Feeling easily frustrated, stressed, or overwhelmed",
        "Constantly moving, craving excitement, or struggling to relax"
      ]
    },
    "Autism": {
      description: "Autism is a condition that affects how people communicate, socialize, and experience the world. Some may find it hard to understand social cues, while others have strong interests or prefer routines. Autism is not a disease—it’s just a different way of thinking and being. With the right support, autistic people can live happy and fulfilling lives.",
      CommonSymptoms: [
        "Difficulty making eye contact, starting conversations, or understanding feelings",
        "Repeating actions, sticking to routines, or needing things to stay the same",
        "Deep focus on specific topics or hobbies",
        "Being very sensitive (or not sensitive at all) to sounds, lights, or textures"
      ]
    },
    "Eating Disorder": {
      description: "Eating disorders are serious mental health conditions that affect a person’s relationship with food, body image, and self-worth. They can cause extreme eating habits, like eating too little, eating too much, or feeling guilty about food. Eating disorders are not just about food—they are often linked to deeper emotional struggles, but with the right support, recovery is possible.",
      CommonSymptoms: [
        "Eating too much, too little, or feeling out of control with food",
        "Obsessing over weight, size, or appearance",
        "Skipping meals, over-exercising, or using laxatives to lose weight",
        "Feeling bad about eating or having strict food rules",
        "Fatigue, dizziness, digestive problems, or sudden weight changes"
      ]
    },
    "Bipolar Disorder": {
      description: "Bipolar disorder causes extreme mood swings, from high-energy 'up' phases (mania) to deep 'down' phases (depression). These shifts can affect daily life, relationships, and work, but with the right help, it can be managed.",
      CommonSymptoms: [
        "High mood",
        "Feeling overly excited, energetic, or powerful",
        "Talking fast, racing thoughts, little need for sleep",
        "Risky decisions, impulsive spending, or reckless behavior",
        "Low mood",
        "Deep sadness, hopelessness, or loss of interest",
        "Low energy, sleep problems, or trouble focusing",
        "Feeling worthless or struggling to find motivation"
      ]
    }
  };


  const list = [
    "Depression",
    "Anxiety",
    "Stress",
    "Relationship",
    "Anger",
    "Loneliness",
    "Trauma and Loss",
    "OCD",
    "Self-Esteem",
    "ADHD",
    "Autism",
    "Eating Disorder",
    "Bipolar Disorder",
    "And More..",
  ];

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    onOpen();
  };

  const DetailSection = ({ title, children }: DetailSectionProps) => (
    <Box mb={6}>
      <Flex align="center" mb={3}>
        <Text fontSize="lg" fontWeight="600">{title}</Text>
      </Flex>
      {children}
    </Box>
  );

  return (
    <>
      <Flex mt={{ base: 1, md: 4 }} flexWrap="wrap" justify={{ base: "center", md: "start" }}>
        {list.map((item) => (
          <Box
            key={item}
            py="clamp(4px, 1vw, 8px)"
            px="clamp(8px, 2vw, 16px)"
            mb={2}
            mr="clamp(4px, 1vw, 12px)"
            // cursor={item === 'And More..' ? 'not-allowed' : 'pointer'}
            transition="all 0.2s"
            w={{ base: "fit-content", md: "auto" }}
            rounded="full"
            border="1px solid #065F68"
            color="#065F68"
            fontSize="clamp(12px, 2vw, 16px)"
            {...(item !== 'And More..' && {
              cursor: 'pointer',
              transition: 'all 0.2s',
              _hover: { bg: hoverBg, color: hoverColor, transform: 'scale(1.05)' },
              onClick: () => handleItemClick(item),
            })}
          >
            {item}
          </Box>
        ))}
      </Flex >
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: 'sm', md: 'xl' }} scrollBehavior='inside'>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader
            bg="#065F68"
            color="white"
            borderTopRadius="xl"
            fontSize="xl"
            fontWeight="bold"
          >
            {/* <FaUserMd style={{ display: 'inline-block', marginRight: '10px' }} /> */}
            {selectedItem}
            <ModalCloseButton color="white" />
          </ModalHeader>
          <ModalBody py={4} className='customScrollBar'>
            {selectedItem && (
              <>
                {conditionDetails[selectedItem]?.description && (
                  <DetailSection title={
                    <Flex align="center">
                      <Image src="/icons/description.svg" alt="Description Icon" width={20} height={20} style={{ marginRight: "8px" }} />
                      <Text>Description</Text>
                    </Flex>
                  }>
                    <Text mb={2}>{conditionDetails[selectedItem]?.description}</Text>
                  </DetailSection>
                )}

                {conditionDetails[selectedItem]?.CommonSymptoms?.length > 0 && (
                  <>
                    <Divider my={4} />
                    <DetailSection title={
                      <Flex align="center">
                        <Image src="/icons/symptoms.svg" alt="Symptoms Icon" width={20} height={20} style={{ marginRight: "8px" }} />
                        <Text>Common Symptoms</Text>
                      </Flex>
                    }>
                      <List spacing={2}>
                        {conditionDetails[selectedItem].CommonSymptoms.map((symptom, index) => (
                          <ListItem key={index}>{symptom}</ListItem>
                        ))}
                      </List>
                    </DetailSection>
                  </>
                )}

                {conditionDetails[selectedItem]?.treatmentOptions?.length > 0 && (
                  <>
                    <Divider my={4} />
                    <DetailSection title={
                      <Flex align="center">
                        <Image src="/icons/treatment.svg" alt="Treatment Icon" width={20} height={20} style={{ marginRight: "8px" }} />
                        <Text>Treatment Options</Text>
                      </Flex>
                    }>
                      <List spacing={2}>
                        {conditionDetails[selectedItem].treatmentOptions.map((treatment, index) => (
                          <ListItem key={index}>{treatment}</ListItem>
                        ))}
                      </List>
                    </DetailSection>
                  </>
                )}

                {conditionDetails[selectedItem]?.keyStatistics?.length > 0 && (
                  <>
                    <Divider my={4} />
                    <DetailSection title={
                      <Flex align="center">
                        <Image src="/icons/statistics.svg" alt="Statistics Icon" width={20} height={20} style={{ marginRight: "8px" }} />
                        <Text>Key Statistics</Text>
                      </Flex>
                    }>
                      <List spacing={2}>
                        {conditionDetails[selectedItem].keyStatistics.map((stat, index) => (
                          <ListItem key={index}>{stat}</ListItem>
                        ))}
                      </List>
                    </DetailSection>
                  </>
                )}

              </>
            )}
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MentalHealthConditions
