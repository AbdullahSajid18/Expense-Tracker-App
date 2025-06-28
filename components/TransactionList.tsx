import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TransactionListType } from '@/types'

const TransactionList = ({
    data,
    title,
    loading,
    emptyListMessage

}: TransactionListType) => {
  return (
    <View>
      <Text>TransactionList</Text>
    </View>
  )
}

export default TransactionList

const styles = StyleSheet.create({})