import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import * as Icons from 'phosphor-react-native'

const HomeCard = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/card.png')}
      resizeMode="stretch"
      style={styles.bgImage}
    >
        <View style={styles.container}>
            <View>
                <View style={styles.totalBalanceRow}>
                    <Typo color={colors.neutral800} size={17} fontWeight={500}>
                        Total Balance
                    </Typo>
                    <Icons.DotsThreeOutline 
                      size={verticalScale(23)}
                      color={colors.black}
                      weight="fill"
                    />
                </View>
                <Typo color={colors.black} size={30} fontWeight={'bold'}>
                    $10,000
                </Typo>
            </View>

        </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
