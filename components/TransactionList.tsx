
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionItemProps, TransactionListType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet, View } from "react-native";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {

  const handleClick = () => {

  }


  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={500}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => <TransactionItem item={item} index={index} handleClick={handleClick} />}
          estimatedItemSize={60}
        />
      </View>
      {
        !loading && data.length == 0 && (
          <Typo size={15} color={colors.neutral400} style={{textAlign: 'center', marginTop: spacingY._15}}>
            {emptyListMessage}
          </Typo>
        )
      }
    </View>
  );
};

const TransactionItem = ({
  item, index, handleClick
}: TransactionItemProps) => {
  return <View>
    <Typo>Transaction Item</Typo>
  </View>;
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDesc: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
