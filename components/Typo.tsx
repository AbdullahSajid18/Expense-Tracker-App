import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'
import { TypoProps } from '@/types'

const Typo = ({
    size,
    color = colors.text,
    fontWeight = '400',
    children,
    style,
    textProps = {}
}: TypoProps) => {
  return (
    <View>
      <Text>Typo</Text>
    </View>
  )
}

export default Typo

const styles = StyleSheet.create({})