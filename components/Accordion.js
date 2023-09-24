import { useCallback, useState } from 'react';
import {
  Box, Divider, HStack, Icon, Pressable, Text,
} from 'native-base';
import { Entypo } from '@expo/vector-icons';
import NativeAccordion from 'react-native-collapsible/Accordion';

/**
 * @typedef Section
 * @property {string} title
 * @property {string} caption
 * @property {string} content
 * @property {React.ReactElement} badge
 * @property {React.ReactElement | string} label
 */

/**
 *
 * @param {Section} section
 * @param {number} index
 * @param {boolean} isActive
 * @returns {React.ReactElement}
 */
function renderHeader(section, index, isActive) {
  const {
    badge, title, caption,
  } = section || {};
  const isBadgedActive = isActive && badge;

  return (
    <HStack
      justifyContent="space-between"
      padding={3}
      borderTopRadius={4}
      backgroundColor={isActive ? '#F5F5F5' : 'transparent'}
    >
      <Box flex={1}>
        <Text fontWeight={700}>{isBadgedActive ? title.split(' (')[0] : title}</Text>
        {!isActive && caption ? <Text fontSize="2xs" color="#9B9A9A">{caption}</Text> : null}
      </Box>
      <Box>
        {isBadgedActive ? badge : (
          <Icon
            as={Entypo}
            name={!isActive ? 'chevron-thin-right' : 'chevron-thin-down'}
            size={4}
            alignSelf="center"
            color="#000000"
            zIndex={1}
          />
        )}
      </Box>
    </HStack>
  );
}

/**
 * Customized and Themed Accordion Component
 * @param {object} props
 * @param {Section[]} props.sections Array of objects
 * @returns {React.ReactElement}
 */
export default function Accordion({
  sections = [],
}) {
  const [activeSections, setActiveSelections] = useState([]);

  const toggleSection = useCallback((index) => {
    if (activeSections.includes(index)) {
      return setActiveSelections(activeSections.filter((value) => index !== value));
    }
    return setActiveSelections([index]);
  }, [activeSections]);

  const renderContent = useCallback((section, index) => (
    <Pressable onPress={() => toggleSection(index)}>
      <HStack backgroundColor="#F5F5F5" paddingBottom={3} paddingX={3} borderBottomRadius={4} justifyContent="space-between">
        <Text fontSize="xs" color="#9B9A9A">{section.content}</Text>
        <Box alignItems="flex-end">
          <Box flex={1}>
            {section?.aside ?? null}
          </Box>
          {section?.badge ? (
            <Icon
              as={Entypo}
              name="chevron-thin-down"
              size={4}
              alignSelf="center"
              color="#000000"
              zIndex={1}
            />
          ) : null}
        </Box>
      </HStack>
    </Pressable>
  ), [toggleSection]);

  const renderFooter = useCallback(() => (
    <Divider />
  ), []);

  const updateSections = useCallback((actives) => {
    setActiveSelections(actives);
  }, []);

  return (
    <NativeAccordion
      activeSections={activeSections}
      sections={sections}
      underlayColor="#00000010"
      renderHeader={renderHeader}
      renderContent={renderContent}
      renderFooter={renderFooter}
      onChange={updateSections}
    />
  );
}
