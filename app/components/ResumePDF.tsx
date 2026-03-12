import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  contact: {
    marginBottom: 10,
  },

  section: {
    marginTop: 12,
  },

  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },

  bullet: {
    marginLeft: 10,
  },
});

export const ResumePDF = ({ resume }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      <Text style={styles.name}>{resume.name}</Text>
      <Text style={styles.contact}>{resume.contact}</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Summary</Text>
        <Text>{resume.summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        {resume.skills.map((skill: string, i: number) => (
          <Text key={i} style={styles.bullet}>• {skill}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {resume.experience.map((exp: string, i: number) => (
          <Text key={i} style={styles.bullet}>• {exp}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        <Text>{resume.education}</Text>
      </View>

    </Page>
  </Document>
);