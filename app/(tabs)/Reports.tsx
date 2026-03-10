import { View, Text } from 'react-native'
import React from 'react'
import DialAgentButton from '@/src/components/DailerAgent'
import DirectCallButton from '@/src/components/DailerAgent'

const settings = () => {
  return (
    <View>
      <Text>settings</Text>
      <DirectCallButton
        phoneNumber='7013567316'
      />
    </View>
  )
}

export default settings