"use client";

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";
import {
  FaCheck,
  FaEnvelope,
  FaExclamationCircle,
  FaFacebook,
  FaGlobe,
  FaInfoCircle,
  FaInstagram,
  FaLinkedin,
  FaPen,
  FaPhoneAlt,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import stores from "../../../../store/stores";

/* -------------------------------------------------------------------------- */
/*  Config & helpers                                                          */
/* -------------------------------------------------------------------------- */

type SocialKey = "facebook" | "instagram" | "twitter" | "linkedin" | "website";

const SOCIALS: {
  key: SocialKey;
  label: string;
  icon: IconType;
  placeholder: string;
  color: string;
}[] = [
  { key: "facebook", label: "Facebook", icon: FaFacebook, placeholder: "facebook.com/username", color: "#1877F2" },
  { key: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "instagram.com/username", color: "#E4405F" },
  { key: "twitter", label: "Twitter (X)", icon: FaTwitter, placeholder: "twitter.com/username", color: "#1DA1F2" },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedin, placeholder: "linkedin.com/in/username", color: "#0A66C2" },
  { key: "website", label: "Website", icon: FaGlobe, placeholder: "yourwebsite.com", color: "#805AD5" },
];

type FormState = {
  email: string;
  phone: string;
  alternatePhone: string;
  alternateEmail: string;
} & Record<SocialKey, string>;

type FormErrors = {
  email: string;
  phone: string;
  alternatePhone: string;
  alternateEmail: string;
};

const EMPTY_ERRORS: FormErrors = {
  email: "",
  phone: "",
  alternatePhone: "",
  alternateEmail: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildForm = (user: any): FormState => ({
  email: user.email || "",
  phone: user.phone || "",
  alternatePhone: user.alternatePhone || "",
  alternateEmail: user.alternateEmail || "",
  facebook: user.socialLinks?.facebook || "",
  instagram: user.socialLinks?.instagram || "",
  twitter: user.socialLinks?.twitter || "",
  linkedin: user.socialLinks?.linkedin || "",
  website: user.socialLinks?.website || "",
});

/** Adds https:// when the user typed a bare domain such as "site.com" */
const normalizeUrl = (value: string) => {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
};

/** "https://www.facebook.com/john" -> "facebook.com/john" */
const prettyUrl = (value: string) =>
  value.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

/* -------------------------------------------------------------------------- */
/*  Small presentational pieces                                               */
/* -------------------------------------------------------------------------- */

/** Titled block. `divided` renders rows separated by hairlines (view mode). */
function Group({
  title,
  children,
  divided = false,
}: {
  title: string;
  children: React.ReactNode;
  divided?: boolean;
}) {
  const titleColor = useColorModeValue("gray.600", "gray.300");
  const bg = useColorModeValue("gray.50", "whiteAlpha.50");
  const border = useColorModeValue("gray.100", "whiteAlpha.200");

  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color={titleColor} mb={2} px={1}>
        {title}
      </Text>
      <Box bg={bg} borderWidth="1px" borderColor={border} rounded="2xl" overflow="hidden">
        {divided ? (
          <VStack divider={<Divider borderColor={border} />} spacing={0} align="stretch">
            {children}
          </VStack>
        ) : (
          <Box p={{ base: 3, md: 5 }}>{children}</Box>
        )}
      </Box>
    </Box>
  );
}

/** One read-only line: icon tile, label, value (optionally tappable). */
function InfoRow({
  icon,
  label,
  value,
  href,
  external = false,
  iconColor,
  display,
}: {
  icon: IconType;
  label: string;
  value?: string;
  href?: string;
  external?: boolean;
  iconColor?: string;
  display?: string;
}) {
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const valueColor = useColorModeValue("gray.800", "gray.100");
  const emptyColor = useColorModeValue("gray.400", "gray.500");
  const tileBg = useColorModeValue("white", "whiteAlpha.100");
  const tileBorder = useColorModeValue("gray.100", "whiteAlpha.200");
  const defaultIconColor = useColorModeValue("purple.500", "purple.200");

  return (
    <Flex align="center" gap={3} px={{ base: 3, md: 4 }} py={3}>
      <Flex
        boxSize={10}
        flexShrink={0}
        align="center"
        justify="center"
        rounded="xl"
        bg={tileBg}
        borderWidth="1px"
        borderColor={tileBorder}
        color={iconColor || defaultIconColor}
      >
        <Icon as={icon} boxSize={4} />
      </Flex>

      <Box minW={0} flex={1}>
        <Text fontSize="xs" color={labelColor} fontWeight="medium">
          {label}
        </Text>
        {value ? (
          href ? (
            <Link
              href={href}
              isExternal={external}
              display="block"
              fontWeight="semibold"
              color={valueColor}
              noOfLines={1}
              _hover={{ textDecoration: "none", color: "purple.500" }}
            >
              {display || value}
            </Link>
          ) : (
            <Text fontWeight="semibold" color={valueColor} noOfLines={1}>
              {value}
            </Text>
          )
        ) : (
          <Text fontSize="sm" color={emptyColor}>
            Not added
          </Text>
        )}
      </Box>
    </Flex>
  );
}

/** Input with an inline icon, sized for thumbs (48px, 16px text = no iOS zoom). */
function Field({
  label,
  icon,
  error,
  helper,
  ...inputProps
}: {
  label: string;
  icon: IconType;
  error?: string;
  helper?: string;
} & InputProps) {
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("white", "whiteAlpha.100");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const helperColor = useColorModeValue("gray.500", "gray.400");

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel fontSize="sm" fontWeight="semibold" color={labelColor} mb={1.5}>
        {label}
      </FormLabel>
      <InputGroup size="lg">
        <InputLeftElement pointerEvents="none" color={iconColor}>
          <Icon as={icon} boxSize={4} />
        </InputLeftElement>
        <Input
          bg={inputBg}
          rounded="xl"
          fontSize="md"
          focusBorderColor="purple.400"
          {...inputProps}
        />
      </InputGroup>
      {error ? (
        <FormErrorMessage fontSize="sm" mt={1.5}>
          <Icon as={FaExclamationCircle} mr={2} />
          {error}
        </FormErrorMessage>
      ) : helper ? (
        <FormHelperText fontSize="xs" color={helperColor} mt={1.5}>
          {helper}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function ProfileSection({ user }: { user: any }) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(() => buildForm(user));
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);

  const headingColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const barBg = useColorModeValue("whiteAlpha.950", "gray.800");
  const barBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const noteColor = useColorModeValue("gray.500", "gray.400");

  const startEdit = () => {
    // Always start from the latest saved values
    setFormData(buildForm(user));
    setErrors(EMPTY_ERRORS);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setFormData(buildForm(user));
    setErrors(EMPTY_ERRORS);
    setIsEditing(false);
  };

  const validateForm = () => {
    const newErrors: FormErrors = { ...EMPTY_ERRORS };
    let isValid = true;

    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const altEmail = formData.alternateEmail.trim();
    const altPhone = formData.alternatePhone.trim();

    if (email && !EMAIL_REGEX.test(email)) {
      newErrors.email = "Enter a valid email address, like name@example.com.";
      isValid = false;
    }
    if (phone && phone.length < 10) {
      newErrors.phone = "Phone number must be at least 10 digits.";
      isValid = false;
    }
    if (altPhone && altPhone.length < 10) {
      newErrors.alternatePhone = "Alternate phone must be at least 10 digits.";
      isValid = false;
    }
    if (altEmail && !EMAIL_REGEX.test(altEmail)) {
      newErrors.alternateEmail = "Enter a valid alternate email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData: Record<string, any> = {};

      const email = formData.email.trim();
      const phone = formData.phone.trim();
      const altEmail = formData.alternateEmail.trim();
      const altPhone = formData.alternatePhone.trim();

      if (phone && phone !== user.phone) updateData.phone = phone;
      if (email && email !== user.email) updateData.email = email;

      // Alternate contacts (can be cleared)
      if (altPhone !== (user.alternatePhone || "")) updateData.alternatePhone = altPhone;
      if (altEmail !== (user.alternateEmail || "")) updateData.alternateEmail = altEmail;

      // Social links (can be cleared)
      const socialLinks: Partial<Record<SocialKey, string>> = {};
      SOCIALS.forEach(({ key }) => {
        const next = normalizeUrl(formData[key]);
        if (next !== (user.socialLinks?.[key] || "")) socialLinks[key] = next;
      });
      if (Object.keys(socialLinks).length > 0) updateData.socialLinks = socialLinks;

      if (Object.keys(updateData).length === 0) {
        toast({
          title: "No changes",
          description: "Nothing was changed on your profile.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        return;
      }

      await stores.auth.updateProfile(updateData);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "We couldn't save your changes. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user starts fixing it
    if (name in errors && errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const filledSocials = SOCIALS.filter(({ key }) => !!user.socialLinks?.[key]);

  return (
    <VStack spacing={5} align="stretch">
      {/* Header */}
      <Flex justify="space-between" align="center" gap={3}>
        <Box minW={0}>
          <Heading as="h2" size="md" color={headingColor}>
            {isEditing ? "Edit profile" : "Profile details"}
          </Heading>
          <Text fontSize="sm" color={mutedColor} mt={0.5}>
            {isEditing
              ? "Change your details, then save."
              : "Your contact information and links."}
          </Text>
        </Box>

        {!isEditing && (
          <Button
            leftIcon={<FaPen size="12px" />}
            size="sm"
            h={10}
            px={4}
            rounded="full"
            variant="outline"
            colorScheme="purple"
            flexShrink={0}
            onClick={startEdit}
          >
            Edit
          </Button>
        )}
      </Flex>

      {/* ------------------------------ VIEW MODE ------------------------------ */}
      {!isEditing && (
        <VStack spacing={5} align="stretch">
          <Group title="Personal" divided>
            <InfoRow icon={FaUser} label="Full name" value={user.name} />
          </Group>

          <Group title="Contact" divided>
            <Grid templateColumns={{md:'1fr 1fr'}}>

            <InfoRow
              icon={FaEnvelope}
              label="Email"
              value={user.email}
              href={user.email ? `mailto:${user.email}` : undefined}
              />
            <InfoRow
              icon={FaPhoneAlt}
              label="Phone"
              value={user.phone}
              href={user.phone ? `tel:${user.phone}` : undefined}
              />
              </Grid>
          </Group>

          <Group title="Alternate contact" divided>
            <InfoRow
              icon={FaEnvelope}
              label="Alternate email"
              value={user.alternateEmail}
              href={user.alternateEmail ? `mailto:${user.alternateEmail}` : undefined}
            />
            <InfoRow
              icon={FaPhoneAlt}
              label="Alternate phone"
              value={user.alternatePhone}
              href={user.alternatePhone ? `tel:${user.alternatePhone}` : undefined}
            />
          </Group>

          <Group title="Social links" divided>
            {filledSocials.length > 0 ? (
              filledSocials.map(({ key, label, icon, color }) => {
                const url = normalizeUrl(user.socialLinks[key]);
                return (
                  <InfoRow
                    key={key}
                    icon={icon}
                    label={label}
                    value={url}
                    display={prettyUrl(url)}
                    href={url}
                    external
                    iconColor={color}
                  />
                );
              })
            ) : (
              <Box px={4} py={4}>
                <Text fontSize="sm" color={mutedColor}>
                  No links added yet. Tap Edit to add your social profiles or website.
                </Text>
              </Box>
            )}
          </Group>
        </VStack>
      )}

      {/* ------------------------------ EDIT MODE ------------------------------ */}
      {isEditing && (
        <Box as="form" onSubmit={handleSubmit} noValidate w="full">
          <VStack spacing={5} align="stretch">
            <Group title="Personal" divided>
              <InfoRow icon={FaUser} label="Full name" value={user.name} />
            </Group>
            <Flex align="center" gap={2} mt={-3} px={1}>
              <Icon as={FaInfoCircle} boxSize={3} color={noteColor} />
              <Text fontSize="xs" color={noteColor}>
                Your name can't be changed.
              </Text>
            </Flex>

            <Group title="Contact">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Field
                  label="Email address"
                  icon={FaEnvelope}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  helper="Used for order confirmations and account security."
                />
                <Field
                  label="Phone number"
                  icon={FaPhoneAlt}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  helper="Used for delivery updates and OTP verification."
                />
              </SimpleGrid>
            </Group>

            <Group title="Alternate contact">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Field
                  label="Alternate email"
                  icon={FaEnvelope}
                  name="alternateEmail"
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  placeholder="alternate@example.com"
                  value={formData.alternateEmail}
                  onChange={handleInputChange}
                  error={errors.alternateEmail}
                />
                <Field
                  label="Alternate phone"
                  icon={FaPhoneAlt}
                  name="alternatePhone"
                  type="tel"
                  inputMode="tel"
                  placeholder="9876543210"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  error={errors.alternatePhone}
                />
              </SimpleGrid>
            </Group>

            <Group title="Social links">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {SOCIALS.map(({ key, label, icon, placeholder }) => (
                  <Field
                    key={key}
                    label={label}
                    icon={icon}
                    name={key}
                    type="text"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    placeholder={placeholder}
                    value={formData[key]}
                    onChange={handleInputChange}
                  />
                ))}
              </SimpleGrid>
            </Group>

            {/* Floating action bar: always reachable on long mobile forms */}
            <Flex
              position="sticky"
              bottom={3}
              zIndex={2}
              gap={3}
              rounded="2xl"
              bg={barBg}
              justify={{ base: "stretch", md: "flex-end" }}
            >
              <Button
                variant="ghost"
                h={12}
                px={6}
                rounded="xl"
                flex={{ base: 1, md: "none" }}
                onClick={cancelEdit}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                h={12}
                px={8}
                rounded="xl"
                flex={{ base: 2, md: "none" }}
                fontWeight="bold"
                leftIcon={<FaCheck />}
                isLoading={isLoading}
                loadingText="Saving"
              >
                Save changes
              </Button>
            </Flex>
          </VStack>
        </Box>
      )}
    </VStack>
  );
}