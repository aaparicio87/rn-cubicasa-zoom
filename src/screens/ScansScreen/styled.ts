import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80, 
  },
  hideFab: {
    opacity: 0,
    zIndex: -1,
  },
});